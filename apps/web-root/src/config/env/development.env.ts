import { appRemotes } from "../remotes.config";
import { env } from "../interface/env.interface";

export const development = (): env => {
  console.log(appRemotes("", true));
  return {
    name: "development",
    remotes: appRemotes("", true),
  };
};
