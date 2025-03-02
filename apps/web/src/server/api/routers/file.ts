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
        id: z.string(),
        originalName: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const newFile = await db.insert(files).values({
        id: input.id,
        originalName: input.originalName,
        size: input.size,
      });

      return { success: true, file: newFile };
    }),
  deleteFiles: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      //TODO: Delete files from db.
      return { success: true };
    }),
  getUploadedFiles: publicProcedure.query(async () => {
    return db.select().from(files).orderBy(desc(files.createdAt));
  }),
});
