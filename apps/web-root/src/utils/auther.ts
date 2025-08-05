export const Auther = async () => {
  const token = await ""; //TODO: get cookies
  if (!token) {
    return "";
  }
  return "Bearer " + token;
};
