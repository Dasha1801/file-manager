import os from "os";
import process from "process";
import readline from "readline";
import { cliHandler } from "./utils";

const allArgs = process.argv.slice(2);
const usernameMatch = allArgs.find((arg) => /^--username=/.test(arg));
const username = usernameMatch
  ? usernameMatch.replace(/^--username=/, "")
  : "User";

process.chdir(os.homedir());

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${process.cwd()}`);

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter command: ",
});

cli.prompt();

cli.on("line", async (line) => {
  if (line.trim() === ".exit") {
    cli.close();
    return;
  }

  await cliHandler(line);

  cli.prompt();
});

cli.on("close", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
