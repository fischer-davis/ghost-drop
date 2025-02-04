import { publicProcedure, router } from "@/server/api/trpc";
import { z } from "zod";

export const postRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
