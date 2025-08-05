import type { UserConfig } from "@commitlint/types";
import { remotesLocal } from "./apps/web-root/src/config/modules.config";

const scopes = remotesLocal.map(({ name }) => name);

scopes.push("core"); //web-root

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-atom",
  formatter: "@commitlint/format",
  rules: {
    "scope-enum": [2, "always", scopes],
    "scope-empty": [2, "never"],
  },
};

export default Configuration;
