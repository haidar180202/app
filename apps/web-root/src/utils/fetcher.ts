import { Auther } from "./auther";

export const fetcher = async (url: string) =>
  await fetch(url).then((r) => r.json());

export const fetcherToken = async (url: string) => {
  const authHeader = await Auther();
  return await fetch(url, { headers: { Authorization: authHeader } }).then(
    (r) => r.json(),
  );
};
