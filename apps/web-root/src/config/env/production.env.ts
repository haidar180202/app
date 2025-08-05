import { appRemotes } from "../remotes.config";
import { env } from "../interface/env.interface";

export const production = (): env => {
  const prefix = process.env.APP_PREFIX;
  const hostname = process.env.APP_HOST;
  const protocol = process.env.APP_PROTOCOL_SCHEME;
  const remote_prefix = process.env.APP_REMOTE_PREFIX;
  return {
    name: "production",
    remotes: appRemotes(prefix, false, protocol, hostname, remote_prefix),
  };
};
