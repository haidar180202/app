import { RemoteConfig } from "./remote.interface";

export interface env {
  name: string;
  remotes: RemoteConfig[];
}
