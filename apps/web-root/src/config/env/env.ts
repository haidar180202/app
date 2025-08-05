import { env } from "../interface/env.interface";
import { development } from "./development.env";
import { production } from "./production.env";
import { staging } from "./staging.env";

export const ENV = (state: string): env => {
  switch (state) {
    case "production":
      return production();
    case "development":
      return development();
    case "staging":
      return staging();
    default:
      throw new Error(`Unknown environment: ${state}`);
  }
};
