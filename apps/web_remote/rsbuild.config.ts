import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

const NODE_ENV = process.env.NODE_ENV as string;
const PROJECT_NAME = process.env.APP_PROJECT_NAME as string;

const { parsed } = loadEnv({ cwd: "../../" });

const isProduction = NODE_ENV === "production";
const protocol = parsed.APP_PROTOCOL_SCHEME || "http";
const hostname = parsed.APP_HOST || "localhost";
const projectName = PROJECT_NAME;
const prefix = parsed.APP_PREFIX || "web-dev";
const remote_prefix = parsed.APP_REMOTE_PREFIX || "remote";
const port = process.env.APP_PORT;

function getAssetPrefix() {
  return isProduction
    ? `${protocol}://${hostname}/${prefix}/${remote_prefix}/${projectName}`
    : `http://localhost:${port}/${prefix}/${remote_prefix}/${projectName}`;
}

export default defineConfig({
  html: {
    crossorigin: true,
  },
  server: {
    port: Number(process.env.APP_PORT) || 3001,
  },
  performance: {
    removeConsole: NODE_ENV === "production",
  },
  dev: {
    // DEV
    // It is necessary to configure assetPrefix,
    // and in the production build,
    // you need to configure output.assetPrefix
    assetPrefix: true,
  },
  output: {
    // PROD
    minify: NODE_ENV === "production",
    assetPrefix: getAssetPrefix(),
    cleanDistPath: parsed.APP_DIST_ON_ROOT === "true" ? true : "auto",
    distPath: {
      root:
        parsed.APP_DIST_ON_ROOT === "true"
          ? `../../dist/${PROJECT_NAME}`
          : `dist`,
    },
  },
  source: {
    define: {
      "process.env.APP_PROJECT_NAME": JSON.stringify(
        process.env.APP_PROJECT_NAME,
      ),
      "process.env.APP_PREFIX": JSON.stringify(prefix),
      "process.env.APP_REMOTE_PREFIX": JSON.stringify(remote_prefix),
      "process.env.PUBLIC_BUCKET": JSON.stringify(process.env.PUBLIC_BUCKET),
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: PROJECT_NAME,
      exposes: {
        "./app": "./src/App",
      },
      shared: ["react", "react-dom"],
      shareStrategy: "loaded-first",
    }),
  ],
});
