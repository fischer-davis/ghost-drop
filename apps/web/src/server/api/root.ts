import { fileRouter } from "@web/server/api/routers/file";
import { userRouter } from "@web/server/api/routers/user";
import { createTRPCRouter } from "@web/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
