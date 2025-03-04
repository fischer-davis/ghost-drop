import { Command } from "commander";
import { uploadFile } from "../utils/api";

export const upload = new Command("upload")
  .alias("u")
  .argument("<file>", "File to upload")
  .action(async (file) => {
    await uploadFile(file);
  });
