import { defineConfig } from "@rsbuild/core";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

const NODE_ENV = (): string => {
  return process.env.NODE_ENV as string;
};

export default defineConfig({
  server: {
    port: 4001,
  },
  performance: {
    removeConsole: NODE_ENV() === "production",
  },
  dev: {
    // DEV
    // It is necessary to configure assetPrefix,
    // and in the production build,
    // you need to configure output.assetPrefix
    assetPrefix: "http://localhost:4001",
  },
  output: {
    // PROD
    polyfill: "entry",
  },

  plugins: [
    pluginModuleFederation({
      name: "@utils/encryption",
      exposes: {
        "./encrypt": "./src/encryption/index",
        "./decrypt": "./src/decryption/index",
      },
      library: {
        name: "utils_encryption",
        type: "var",
      },
    }),
  ],
});
