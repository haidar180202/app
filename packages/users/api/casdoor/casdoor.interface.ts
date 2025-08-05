export interface LoginBody {
  application: string;
  organization: string;
  username: string;
  password: string;
  autoSignin: boolean;
  signinMethod: string;
  type: string;
}

export interface LoginParams {
  clientId: string;
  responseType: string;
  redirectUri: string;
  type: string;
  scope: string;
  state: string;
}

export interface OAuthAccessTokenParams {
  grant_type: string;
  client_id: string;
  client_secret: string;
  code: string;
}
