export function Err(err: Error | string) {
  throw new Error(`@${process.env.PROJECT_NAME}: ${err}`);
}
