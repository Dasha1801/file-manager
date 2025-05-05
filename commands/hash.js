import crypto from "crypto";
import fs from "fs";
import path from "path";
import process from "process";

export const hash = async (filePath) => {
  try {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const hash = crypto.createHash("sha256");

    try {
      const stream = fs.createReadStream(resolvedPath);

      const fileHash = await new Promise((resolve, reject) => {
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", (err) => reject(err));
      });

      console.log(fileHash);
      return fileHash;
    } catch (streamError) {
      throw new Error(`File stream error: ${streamError.message}`);
    }
  } catch (err) {
    console.error("Operation failed:", err.message);
    throw err;
  }
};
