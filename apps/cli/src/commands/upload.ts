import { Command } from "commander";
import { uploadFile } from "../utils/api";
import chalk from "chalk";

export const upload = new Command("upload")
  .alias("u")
  .argument("<file>", "File to upload")
  .action(async (file) => {
    console.log(chalk.green(`Uploading file: ${file}`));
    const result = await uploadFile(file);
    console.log(chalk.green(`Upload successful: ${result.url}`));
  });
