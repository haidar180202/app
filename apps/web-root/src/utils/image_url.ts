const imageUrl = (path: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}/${process.env.APP_PREFIX}`
      : "";

  return `${baseUrl}/${path}`;
};

export default imageUrl;
