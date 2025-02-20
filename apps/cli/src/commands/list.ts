// Delete command
import { Command } from "commander";
import { listFiles } from "../utils/api.ts";

export const list = new Command("list")
  .alias("l")
  .description("List all files on the server.")
  .action(async () => {
    try {
      const files = await listFiles();
      console.log("Files on server:", files);
    } catch {
      console.error("Failed to retrieve file list");
    }
  });
