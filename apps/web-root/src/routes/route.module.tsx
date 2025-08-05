// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// HERE IS LIES GEN-CODE
// DO NOT EDIT

// ts check is disabled because the remotes on bundler configuratation
// using dynamic injection based on folder
import { lazy } from "react";
import { ErrLoadModule } from "../components/common/Err/500";

// Must add module/App manually/USING code gen
// because bundler/compiler analyzer is did not understand
// how to compile dynamic strings

export const Module1 = lazy(() =>
  import("web_remote/app").catch(() => {
    return { default: () => <ErrLoadModule /> };
  }),
);
