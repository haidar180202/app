import fs from "fs";

const folderPath: string = "../../apps"; // TO THE APPS

export const getAppsName = (): string[] => {
  try {
    return fs.readdirSync(folderPath).filter((app) => app !== "web-root");
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
};
