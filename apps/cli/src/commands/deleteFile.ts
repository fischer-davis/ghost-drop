// Delete command
import { Command } from "commander";
import { deleteFiles } from "../utils/api.ts";

export const deleteFile = new Command("delete")
  .alias("d")
  .argument("<fileId>", "ID of the file to delete")
  .action(async (fileId) => {
    try {
      const result = await deleteFiles(fileId);
      console.log("Delete successful:", result);
    } catch {
      console.error("Failed to delete: ", fileId);
    }
  });
