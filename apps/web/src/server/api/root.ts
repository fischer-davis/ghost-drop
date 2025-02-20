import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { fileRouter } from "@/server/api/routers/file";

export const appRouter = createTRPCRouter({
  user: userRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
