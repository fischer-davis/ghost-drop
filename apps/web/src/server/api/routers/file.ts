import fs from "fs";
import path from "path";
import { createTRPCRouter, publicProcedure } from "@web/server/api/trpc";
import { db } from "@web/server/db";
import { files } from "@web/server/db/schema";
import { desc, inArray } from "drizzle-orm";
import { z } from "zod";

export const fileRouter = createTRPCRouter({
  saveFileMetadata: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        filePath: z.string(),
        fileSize: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const newFile = await db.insert(files).values({
        filename: input.filename,
        filePath: input.filePath,
        fileSize: input.fileSize,
      });

      return { success: true, file: newFile };
    }),
  deleteFiles: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      const fileRecords = await db
        .select()
        .from(files)
        .where(inArray(files.id, input))
        .all();

      if (fileRecords.length === 0) {
        return { success: false, error: "Files not found" };
      }

      const errors: { id: string; error: string }[] = [];

      for (const fileRecord of fileRecords) {
        const filePath = path.join(process.cwd(), fileRecord.filePath);

        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error("Error deleting file from file system:", error);
          errors.push({
            id: fileRecord.id,
            error: "Error deleting file from file system",
          });
        }
      }

      await db.delete(files).where(inArray(files.id, input));

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true };
    }),
  getUploadedFiles: publicProcedure.query(async () => {
    return db.select().from(files).orderBy(desc(files.uploadedAt));
  }),
});
