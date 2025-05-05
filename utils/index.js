import { mkdir } from "../commands/mkdir.js";
import { add, cat, cp, mv, rm, rn } from "../commands/file.js";
import { compress, decompress } from "../commands/zip.js";
import { hash } from "../commands/hash.js";
import { architecture, cpu, eol, homedir, username } from "../commands/os.js";
import { cd, ls, up } from "../commands/navigation.js";

export const cliHandler = async (input) => {
  if (!input.trim()) return;

  const [command, ...args] = input.trim().split(/\s+/);
  const argString = args.join(" ");

  try {
    switch (command) {
      case "mkdir":
        await mkdir(argString);
        break;
      case "add":
        await add(argString);
        break;
      case "cat":
        await cat(argString);
        break;
      case "cp":
      case "mv":
        if (args.length < 2)
          throw new Error(`Usage: ${command} <source> <destination>`);
        await (command === "cp" ? cp(args[0], args[1]) : mv(args[0], args[1]));
        break;
      case "rm":
        await rm(argString);
        break;
      case "rn":
        if (args.length < 2) throw new Error("Usage: rn <oldPath> <newName>");
        await rn(args[0], args[1]);
        break;
      case "compress":
      case "decompress": {
        const [source, dest] = args;
        await (command === "compress"
          ? compress(source, dest)
          : decompress(source, dest));
        break;
      }
      case "hash":
        await hash(argString);
        break;
      case "os":
        if (args[0] === "--architecture") {
          architecture();
        } else if (args[0] === "--cpus") {
          cpu();
        } else if (args[0] === "--EOL") {
          eol();
        } else if (args[0] === "--homedir") {
          homedir();
        } else if (args[0] === "--username") {
          username();
        } else {
          console.log("Invalid input");
        }
        break;
      case "ls":
        await ls();
        break;
      case "up":
        up();
        break;
      case "cd":
        await cd(argString);
        break;
      default:
        console.log(`Invalid command: ${command}`);
        return;
    }
  } catch {
    console.log("Operation failed");
  } finally {
    console.log(`You are currently in ${process.cwd()}`);
  }
};
