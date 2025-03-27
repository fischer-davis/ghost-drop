import { files } from "@server/db/schema";
import { db } from "apps/server/src/db";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const fileRouter = router({
  saveFileMetadata: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("Received input:", input);
      const newFile = await db.insert(files).values({
        id: input.id,
        name: input.name,
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
