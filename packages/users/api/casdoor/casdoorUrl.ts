export const PUBLIC_CASDOOR_PROVIDER_URL = "http://10.4.9.79:4000";
export const PUBLIC_AZURE_CLIENT_ID = "a86e5935-e6a4-40af-a07a-e9e24703e2a2";
export const CASDOOR_CLIENT_SECRET = "cfb1352746baabdf155f95d0830218d06e78d55d";
export const PUBLIC_URL_CALLBACK =
  "https://casdoor-dev.bukitasam.co.id/callback";
let NODE_ENV = "development";
export const APP_PORT = 3000;

export const AUTH_CALLBACK_PATH = "/auth/callback";
export const AUTH_SIGNIN_PATH = "/auth/login";
export const HOSTNAME =
  NODE_ENV === "production"
    ? "https://" + window.location.hostname
    : "http://" + window.location.hostname + ":" + APP_PORT;
