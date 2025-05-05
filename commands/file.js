import fs from "fs"; 
import fsPromises from "fs/promises";
import path from "path";
import process from "process";

const { writeFile, stat, access, unlink, copyFile, mkdir, rename } = fsPromises;

const add = async (fileName) => {
  try {
    await writeFile(path.resolve(process.cwd(), fileName), "", {
      encoding: "utf8",
      flag: "wx",
      mode: 0o666,
    });
  } catch {
    console.error("Operation failed");
  }
};

const cat = async (filePath) => {
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  try {
    const stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      throw new Error(`Path ${resolvedPath} is not a file`);
    }

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(resolvedPath, {
        encoding: "utf-8",
        highWaterMark: 64 * 1024,
      });

      stream.on("data", (chunk) => {
        process.stdout.write(chunk);
      });

      stream.on("end", () => {
        process.stdout.write("\n");
        resolve();
      });

      stream.on("error", (err) => {
        console.error(`Error reading file ${filePath}:`, err.message);
        reject(err);
      });
    });
  } catch (err) {
    console.error(`Operation failed for: ${err.message}`);
    throw err;
  }
};

const cp = async (filePath, destDir) => {
  try {
    const source = path.resolve(process.cwd(), filePath);
    const destination = path.resolve(
      process.cwd(),
      destDir,
      path.basename(filePath)
    );

    const stats = await stat(source);
    if (!stats.isFile()) throw new Error("Source is not a file");

    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination, fs.constants.COPYFILE_EXCL);

    console.log(`Copied ${filePath} to ${destination}`);
  } catch (err) {
    throw new Error("Operation failed for: " + err.message);
  }
};

const mv = async (filePath, dir) => {
  const source = path.resolve(filePath);
  const destination = path.resolve(dir, path.basename(filePath));

  try {
    await access(source);
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(source, destination);
  } catch {
    throw new Error("Operation failed");
  }
};

const rm = async (filePath) => {
  if (!filePath) {
    throw new Error("File path is required");
  }

  const resolvedPath = path.resolve(process.cwd(), filePath);
  try {
    const stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      throw new Error("Cannot delete - target is not a file");
    }

    await unlink(resolvedPath);
  } catch {
    throw new Error("Operation failed");
  }
};

const rn = async (oldPath, newName) => {
  try {
    if (!oldPath || !newName)
      throw new Error("OldPath and newName are required");

    const currentPath = path.resolve(oldPath);
    const newPath = path.join(path.dirname(currentPath), newName);
    await rename(currentPath, newPath);
  } catch {
    console.error("Operation failed");
  }
};

export { add, cat, cp, mv, rm, rn };