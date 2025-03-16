import { AppRouter, appRouter } from "@server/trpc/root";
import { createCallerFactory } from "@server/trpc/trpc";
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { auth } from "@web/lib/auth";
import { db } from "apps/server/src/db";
import fastify from "fastify";
import FastifyBetterAuth from "fastify-better-auth";
import fp from "fastify-plugin";

const app = fastify({ logger: true });

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db };
}
export type Context = Awaited<ReturnType<typeof createContext>>;

// Register tRPC router with Fastify
app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

const caller = createCallerFactory(appRouter)({
  req: { ip: "server" }, // Provide the actual request object
  db, // Provide the database instance
});

await app.register(FastifyBetterAuth, { auth });

// Setup TUS server
const tusServer = new Server({
  path: "/files",
  onUploadFinish: async (req, res, file) => {
    try {
      console.log("File uploaded");

      // Call the tRPC route
      await caller.file.saveFileMetadata({
        id: file.id,
        name: file.metadata?.filename || "unknown",
        size: file.size || 0,
      });
      console.log(
        `${file.metadata?.filename || "unknown"} metadata saved to database.`,
      );
    } catch (error) {
      console.error("Error updating database:", error);
    }

    return res;
  },
  datastore: new FileStore({ directory: "../upload" }),
});

// Middleware for TUS protocol
app.addContentTypeParser(
  "application/offset+octet-stream",
  (request, payload, done) => done(null),
);

// TUS endpoints
app.all("/files", (req, res) => {
  tusServer.handle(req.raw, res.raw);
});
app.all("/files/*", (req, res) => {
  tusServer.handle(req.raw, res.raw);
});

app
  .listen({ port: 3010 })
  .then(() => {
    console.log(`Server listening on port 3000`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
