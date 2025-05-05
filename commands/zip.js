import fs from "fs";
import path from "path";
import process from "process";
import zlib from "zlib";

const { createReadStream, createWriteStream } = fs;
const { createBrotliDecompress } = zlib;

const decompress = async (inputPath, outputPath) => {
  try {
    const inputFullPath = path.resolve(process.cwd(), inputPath);
    let outputFullPath = path.resolve(process.cwd(), outputPath);

    if (outputFullPath.endsWith(".gz")) {
      outputFullPath = outputFullPath.slice(0, -3);
    }

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
    throw new Error("Operation failed");
  }
};

const compress = async (inputPath, outputPath) => {
  const inputFullPath = path.resolve(inputPath);
  let outputFullPath = path.resolve(outputPath);

  if (!outputFullPath.endsWith(".gz")) {
    outputFullPath += ".gz";
  }

  try {
    await fs.promises.access(inputFullPath);
    const stats = await fs.promises.stat(inputFullPath);
    if (!stats.isFile()) throw new Error("Source is not a file");

    await fs.promises.mkdir(path.dirname(outputFullPath), { recursive: true });

    const readStream = createReadStream(inputFullPath);
    const writeStream = createWriteStream(outputFullPath);
    const gzipStream = createGzip();

    const handleError = (err) => {
      readStream.destroy();
      writeStream.destroy();
      throw err;
    };

    readStream.on("error", handleError);
    writeStream.on("error", handleError);

    readStream.pipe(gzipStream).pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  } catch (err) {
    throw new Error("Operation failed");
  }
};

export { decompress, compress };
