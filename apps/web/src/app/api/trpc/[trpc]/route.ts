import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContextFromRequest } from "@web/server/api/client";
import { appRouter } from "@web/server/api/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    onError: ({ path, error }) => {
      if (process.env.NODE_ENV === "development") {
        console.error(`❌ tRPC failed on ${path}`);
      }
      console.error(error);
    },

    createContext: async (opts) => {
      return await createContextFromRequest(opts.req);
    },
  });
export { handler as GET, handler as POST };
