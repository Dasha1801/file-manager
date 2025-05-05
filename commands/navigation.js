import process from "process";
import path from "path";
import fs from "fs/promises";

const cd = async (targetPath) => {
  try {
    const resolvedPath = path.resolve(process.cwd(), targetPath);

    const stats = await fs.promises.stat(resolvedPath);
    if (!stats.isDirectory()) {
      throw new Error(`"${targetPath}" is not a directory`);
    }

    process.chdir(resolvedPath);
  } catch {
    console.error("Operation failed");
  }
};

const ls = async () => {
  try {
    const currentDir = process.cwd();
    const items = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

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
  } catch {
    console.error("Operation failed");
  }
};

const up = () => {
  try {
    const parentDir = path.resolve(process.cwd(), "..");

    if (path.relative(os.homedir(), parentDir).startsWith("..")) return;

    process.chdir(parentDir);
  } catch {
    console.error("Operation failed");
  }
};

export { cd, ls, up };
