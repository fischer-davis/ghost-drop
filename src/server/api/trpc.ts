/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import {initTRPC, TRPCError} from "@trpc/server";
import superjson from "superjson";
import {ZodError} from "zod";

import {type db} from "@/server/db";

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

interface User {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  role: "admin" | "user" | null;
}

export interface Context {
  user: User | null;
  db: typeof db;
  req: {
    ip: string | null;
  };
}

export interface AuthedContext {
  user: User;
  db: typeof db;
  req: {
    ip: string | null;
  };
}

export const router = t.router;

export const procedure = t.procedure.use(function isDemoMode(opts) {
  return opts.next();
});

export const publicProcedure = procedure;

export const authedProcedure = procedure.use(function isAuthed(opts) {
  const user = opts.ctx.user;

  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      user,
    },
  });
});

export const adminProcedure = authedProcedure.use(function isAdmin(opts) {
  const user = opts.ctx.user;
  if (user.role != "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return opts.next(opts);
});
