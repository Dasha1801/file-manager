import process from "process";
import path from "path";
import fs from "fs/promises";
import os from "os";

const cd = async (targetPath) => {
  try {
    const resolvedPath = path.resolve(process.cwd(), targetPath);

    const stats = await fs.stat(resolvedPath);
    if (!stats.isDirectory()) {
      throw new Error(`${targetPath} is not a directory`);
    }

    process.chdir(resolvedPath);
    console.log(`Current directory: ${process.cwd()}`);
  } catch (err) {
    console.error("Operation failed");
    console.error(err.message);
  }
};

const ls = async () => {
  try {
    const currentDir = process.cwd();
    const items = await fs.readdir(currentDir, { withFileTypes: true });

    const directories = items
      .filter((item) => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    const files = items
      .filter((item) => item.isFile())
      .sort((a, b) => a.name.localeCompare(b.name));

    const result = [
      ...directories.map((item) => ({
        Name: item.name,
        Type: "directory",
        Extension: "-",
      })),
      ...files.map((item) => ({
        Name: item.name,
        Type: "file",
        Extension: path.extname(item.name) || "none",
      })),
    ];

    console.log(`\nContents of ${currentDir}:\n`);
    console.table(result);
  } catch (err) {
    console.error("Operation failed");
    console.error(err.message);
  }
};

const up = () => {
  try {
    const parentDir = path.resolve(process.cwd(), "..");

    if (parentDir === os.homedir()) {
      console.log("Cannot go above home directory");
      return;
    }

    process.chdir(parentDir);
    console.log(`Current directory: ${process.cwd()}`);
  } catch (err) {
    console.error("Operation failed");
    console.error(err.message);
  }
};

export { cd, ls, up };
