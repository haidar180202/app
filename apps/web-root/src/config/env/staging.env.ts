import { appRemotes } from "../remotes.config";
import { env } from "../interface/env.interface";

export const staging = (): env => {
  const prefix = "/web";
  return {
    name: "staging",
    remotes: appRemotes(prefix),
  };
};
