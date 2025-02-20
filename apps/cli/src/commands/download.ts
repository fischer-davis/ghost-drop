import { Command } from "commander";
import { downloadFile } from "../utils/api";
import chalk from "chalk";

export const download = new Command("download")
  .alias("d")
  .argument("<fileId>", "ID of the file to download")
  .action(async (fileId) => {
    console.log(chalk.blue(`Downloading file with ID: ${fileId}`));
    await downloadFile(fileId);
    console.log(chalk.blue("Download complete!"));
  });
