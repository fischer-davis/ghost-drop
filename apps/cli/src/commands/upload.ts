import chalk from "chalk";
import { Command } from "commander";
import { uploadFile } from "../utils/api";

export const upload = new Command("upload")
  .alias("u")
  .argument("<file>", "File to upload")
  .action(async (file) => {
    console.log(chalk.green(`Uploading file: ${file}`));
    await uploadFile(file);
    console.log(chalk.green(`Upload successful`));
  });
