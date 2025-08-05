import {
  AUTH_CALLBACK_PATH,
  AUTH_SIGNIN_PATH,
  CASDOOR_CLIENT_SECRET,
  HOSTNAME,
  PUBLIC_AZURE_CLIENT_ID,
  PUBLIC_CASDOOR_PROVIDER_URL,
} from "./casdoorUrl";

const ServerUrl = PUBLIC_CASDOOR_PROVIDER_URL + "/v1" || "http://localhost:3005";
const clientId = PUBLIC_AZURE_CLIENT_ID as string;
const aplication = "cisea";
const orgName = "bukitasam";
const clientSecret = CASDOOR_CLIENT_SECRET as string;

export const casdoorConfig = {
  authProviderUrl: ServerUrl,
  clientId: clientId,
  appName: aplication,
  organizationName: orgName,
  redirectPath: AUTH_CALLBACK_PATH,
  signinPath: AUTH_SIGNIN_PATH,
  hostname: HOSTNAME,
  clientSecret: clientSecret,
};

const ServerUrlVerificationMicrosoft =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

export const CasdoorConfigAAD = {
  authProviderUrl: `${ServerUrlVerificationMicrosoft}`,
  clientId: clientId,
  scope: "user.read",
  responseType: "code",
  state:
    "P2NsaWVudF9pZD01OTZhODgwMGEzZDNlOWQwYzY3MiZyZXNwb25zZV90eXBlPWNvZGUmcmVkaXJlY3RfdXJpPWh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC93ZWItZGV2L2F1dGgvY2FsbGJhY2smc2NvcGU9cmVhZCZzdGF0ZT1jYXNkb29yJmFwcGxpY2F0aW9uPWNpc2VhJnByb3ZpZGVyPWF1dGguZW50cmFpZCZtZXRob2Q9c2lnbnVw",
};
