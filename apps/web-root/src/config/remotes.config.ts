import { getAppsName } from "../utils/module_reader";
import { RemoteConfig } from "./interface/remote.interface";
import { remotesLocal } from "./modules.config";

export const createRemotes = (
  remotes: RemoteConfig[],
): Record<string, string> => {
  return remotes.reduce(
    (acc, { name, url }) => {
      acc[name] = `${name}@${url}/mf-manifest.json`;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const appRemotes = (
  prefix?: string,
  isLocal: boolean = false,
  protocol?: string,
  hostname?: string,
  remote_prefix?: string,
): RemoteConfig[] => {
  const apps = getAppsName();
  let remotes: RemoteConfig[] = [];
  if (isLocal) {
    remotes = remotesLocal;
  } else {
    apps.forEach((app) =>
      remotes.push({
        name: app,
        url: `${protocol}://${hostname}/${prefix}/${remote_prefix}/${app}`,
      }),
    );
  }
  return remotes;
};
