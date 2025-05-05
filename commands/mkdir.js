import path from "path";
import fs from "fs/promises";
import process from "process";

export const mkdir = async (dirName) => {
  try {
    if (!dirName) throw new Error("Directory name is required");

    await fs.mkdir(path.resolve(process.cwd(), dirName));
  } catch {
    console.error("Operation failed");
  }
};
