import { auth } from "@web/lib/auth";
import { authenticateApiKey } from "@web/server/api/auth";
import { appRouter } from "@web/server/api/root";
import { createCallerFactory, type Context } from "@web/server/api/trpc";
import { db } from "@web/server/db";
import { headers } from "next/headers";
import requestIp from "request-ip";

export async function createContextFromRequest(req: Request) {
  // TODO: This is a hack until we offer a proper REST API instead of the trpc based one.
  // Check if the request has an Authorization token, if it does, assume that API key authentication is requested.
  const ip = requestIp.getClientIp({
    headers: Object.fromEntries(req.headers.entries()),
  });
  const authorizationHeader = req.headers.get("Authorization");
  if (authorizationHeader?.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1] ?? "";
    try {
      const user = await authenticateApiKey(token);
      return {
        user,
        db,
        req: {
          ip,
        },
      };
    } catch (e) {
      // Fallthrough to cookie-based auth
    }
  }

  return createContext(db, ip);
}

export const createContext = async (
  database?: typeof db,
  ip?: string | null,
): Promise<Context> => {
  const hdrs = await headers();
  const session = await auth.api.getSession({
    headers: hdrs,
  });
  if (ip === undefined) {
    ip = requestIp.getClientIp({
      headers: Object.fromEntries(hdrs.entries()),
    });
  }
  return {
    user: session?.user
      ? {
          ...session.user,
          role: "user", // Add the role property here
        }
      : null,
    db: database ?? db,
    req: {
      ip,
    },
  };
};

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(createContext);

export const createTrcpClientFromCtx = createCaller;
