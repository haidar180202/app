import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { ENV } from "./src/config/env/env";
import { createRemotes } from "./src/config/remotes.config";

const NODE_ENV = process.env.NODE_ENV as string;

const { parsed } = loadEnv({ cwd: "../../" });

const isProduction = NODE_ENV === "production";
const protocol = parsed.APP_PROTOCOL_SCHEME || "http";
const hostname = parsed.APP_HOST || "localhost";
const prefix = parsed.APP_PREFIX || "web-dev";
const port = process.env.APP_PORT || 3000;

function getAssetPrefix() {
  return isProduction
    ? `${protocol}://${hostname}/${prefix}/`
    : `http://localhost:${port}/${prefix}/`;
}

export default defineConfig({
  html: {
    crossorigin: true,
    title: "Cisea",
  },
  server: {
    port: 3000,
  },
  dev: {
    assetPrefix: getAssetPrefix(),
  },
  output: {
    minify: NODE_ENV === "production",
    assetPrefix: getAssetPrefix(),
    cleanDistPath: parsed.APP_DIST_ON_ROOT === "true" ? true : "auto",
    distPath: {
      root: parsed.APP_DIST_ON_ROOT === "true" ? `../../dist/web-root` : `dist`,
    },
  },
  performance: {
    removeConsole: NODE_ENV === "production",
  },
  source: {
    define: {
      "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.APP_PORT":
        NODE_ENV !== "production" && JSON.stringify(process.env.APP_PORT),
      "process.env.CASDOOR_CLIENT_SECRET": JSON.stringify(
        process.env.CASDOOR_CLIENT_SECRET,
      ),
      "process.env.APP_HOST": JSON.stringify(hostname),
      "process.env.APP_PROTOCOL": JSON.stringify(protocol),
      "process.env.APP_PREFIX": JSON.stringify(prefix),
      "process.env.PUBLIC_BUCKET": JSON.stringify(process.env.PUBLIC_BUCKET),
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "host",
      remotes: createRemotes(ENV(NODE_ENV).remotes),
      // The remote will share package with parent (host)
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        "@tanstack/react-query": { singleton: true },
      },
      shareStrategy: "loaded-first",
    }),
  ],
});
