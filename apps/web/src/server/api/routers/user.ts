import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  authedProcedure,
  publicProcedure,
  router,
  type Context,
} from "@web/server/api/trpc";
import { users } from "@web/server/db/schema";
import { zSignUpSchema } from "@web/types/users";
import { and, count, eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { z } from "zod";
import { hashPassword, validatePassword } from "../auth";

export async function createUser(
  input: z.infer<typeof zSignUpSchema>,
  ctx: Context,
  role?: "user" | "admin",
) {
  return ctx.db.transaction(async (trx) => {
    let userRole = role;
    if (!userRole) {
      const res = await trx.select({ count: count() }).from(users);

      userRole = res[0]?.count == 0 ? "admin" : "user";
    }

    try {
      const result = await trx
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: await hashPassword(input.password),
          role: userRole,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        });
      return result[0];
    } catch (e) {
      if (e) {
        if (e.code == "UNIQUE_VIOLATION") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email is already taken",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  });
}

export const userRouter = router({
  create: publicProcedure
    .input(zSignUpSchema)
    .output(
      z
        .object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          role: z.enum(["user", "admin"]).nullable(),
        })
        .or(z.undefined()),
    )
    .mutation(async ({ input, ctx }) => {
      return createUser(input, ctx);
    }),
  list: adminProcedure
    .output(
      z.object({
        users: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.enum(["user", "admin"]).nullable(),
            localUser: z.boolean(),
          }),
        ),
      }),
    )
    .query(async ({ ctx }) => {
      const dbUsers = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          password: users.password,
        })
        .from(users);

      return {
        users: dbUsers.map(({ password, ...user }) => ({
          ...user,
          localUser: password !== null,
        })),
      };
    }),
  changePassword: authedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      invariant(ctx.user.email, "A user always has an email specified");
      let user;
      try {
        user = await validatePassword(ctx.user.email, input.currentPassword);
      } catch (e) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      invariant(user.id, ctx.user.id);
      await ctx.db
        .update(users)
        .set({
          password: await hashPassword(input.newPassword),
        })
        .where(eq(users.id, ctx.user.id));
    }),
  delete: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.delete(users).where(eq(users.id, input.userId));
      // if (res.changes == 0) {
      //     throw new TRPCError({ code: "NOT_FOUND" });
      // }
      // await deleteUserAssets({ userId: input.userId });
    }),
  whoami: authedProcedure
    .output(
      z.object({
        id: z.string(),
        name: z.string().nullish(),
        email: z.string().nullish(),
      }),
    )
    .query(async ({ ctx }) => {
      if (!ctx.user.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const userDb = await ctx.db.query.users.findFirst({
        where: and(eq(users.id, ctx.user.id), eq(users.email, ctx.user.email)),
      });
      if (!userDb) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return { id: ctx.user.id, name: ctx.user.name, email: ctx.user.email };
    }),
});
