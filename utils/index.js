import { mkdir } from "../commands/mkdir.js";
import { add, cat, cp, mv, rm, rn } from "../commands/file.js";

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
      default:
        console.log(`Invalid command: ${command}`);
        return;
    }
  } catch {
    console.log("Operation failed");
  } finally {
    console.log(`Current directory: ${process.cwd()}`);
  }
};
