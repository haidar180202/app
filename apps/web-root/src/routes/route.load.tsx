import Layout from "../layout/layout";
import { ReactNode } from "react";

export function Load({ node }: { node: ReactNode }) {
  return <Layout>{node}</Layout>;
}
