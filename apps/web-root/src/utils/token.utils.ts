const TOKEN_KEY = "jwt";
const TOKEN_EX_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const EXPIRES_IN_KEY = "expires_in";

export const token = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getTokenEx(): string | null {
    return localStorage.getItem(TOKEN_EX_KEY);
  },

  setTokenEx(tokenEx: string): void {
    localStorage.setItem(TOKEN_EX_KEY, tokenEx);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getExpiresIn(): number | null {
    const value = localStorage.getItem(EXPIRES_IN_KEY);
    return value ? Number(value) : null;
  },

  setExpiresIn(expiresIn: number): void {
    localStorage.setItem(EXPIRES_IN_KEY, expiresIn.toString());
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EX_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_IN_KEY);
    localStorage.removeItem("groupsAkses");
  },
};
