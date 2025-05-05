import fs from "fs";
import path from "path";
import process from "process";
import zlib from "zlib";

const { createReadStream, createWriteStream } = fs;
const { createBrotliCompress, createBrotliDecompress } = zlib;

const compress = async (inputPath, outputPath) => {
  const inputFullPath = path.resolve(process.cwd(), inputPath);
  let outputFullPath = path.resolve(process.cwd(), outputPath);

  if (!outputFullPath.endsWith(".br")) {
    outputFullPath += ".br";
  }

  try {
    await fs.promises.access(inputFullPath);
    const stats = await fs.promises.stat(inputFullPath);
    if (!stats.isFile()) throw new Error("Source is not a file");

    await fs.promises.mkdir(path.dirname(outputFullPath), { recursive: true });

    const readStream = createReadStream(inputFullPath);
    const writeStream = createWriteStream(outputFullPath);
    const brotliStream = createBrotliCompress();

    const handleStreamError = (err) => {
      readStream.destroy();
      writeStream.destroy();
      throw new Error(`Stream error: ${err.message}`);
    };

    readStream.on("error", handleStreamError);
    writeStream.on("error", handleStreamError);

    readStream.pipe(brotliStream).pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  } catch (err) {
    throw new Error(`Operation failed: ${err.message}`);
  }
};

const decompress = async (inputPath, outputPath) => {
  const inputFullPath = path.resolve(process.cwd(), inputPath);
  let outputFullPath = path.resolve(process.cwd(), outputPath);

  if (outputFullPath.endsWith(".br")) {
    outputFullPath = outputFullPath.slice(0, -3);
  }

  try {
    await fs.promises.access(inputFullPath);
    const stats = await fs.promises.stat(inputFullPath);
    if (!stats.isFile()) throw new Error("Input is not a file");

    await fs.promises.mkdir(path.dirname(outputFullPath), { recursive: true });

    const readStream = createReadStream(inputFullPath);
    const writeStream = createWriteStream(outputFullPath);
    const brotliStream = createBrotliDecompress();

    const handleStreamError = (err) => {
      readStream.destroy();
      writeStream.destroy();
      throw new Error(`Stream error: ${err.message}`);
    };

    readStream.on("error", handleStreamError);
    writeStream.on("error", handleStreamError);

    readStream.pipe(brotliStream).pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  } catch (err) {
    throw new Error(`Operation failed: ${err.message}`);
  }
};

export { compress, decompress };
