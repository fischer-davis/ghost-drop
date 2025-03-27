import { fileRouter } from "./routers/file";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
