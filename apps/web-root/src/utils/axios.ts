import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { token } from "./token.utils";

type FailedQueueItem = {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

const createAPI = (baseURL: string) => {
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const jwt = token.getToken();
      if (jwt && config.headers) {
        config.headers.Authorization = `Bearer ${jwt}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return api(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post<{
            token: string;
            refresh_token: string;
            expires_in: number;
          }>(`${process.env.PUBLIC_API_AUTH_URL}/api/refresh-token`, {
            refresh_token: token.getRefreshToken(),
          });

          const {
            token: newToken,
            refresh_token: newRefreshToken,
            expires_in: newExpiresIn,
          } = response.data;
          token.setToken(newToken);
          token.setRefreshToken(newRefreshToken);
          token.setExpiresIn(newExpiresIn);
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          token.clear();
          window.location.href = ``;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
  return api;
};

export default createAPI;
