import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { desc } from "drizzle-orm";

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

  getUploadedFiles: publicProcedure.query(async () => {
    return db.select().from(files).orderBy(desc(files.uploadedAt));
  }),
});
