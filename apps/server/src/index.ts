import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import fastify from "fastify";
import { AppRouter } from "../../web/src/server/api/root";

const app = fastify({ logger: true });

// Setup TUS server
const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({ directory: "../upload" }),
});

// Setup tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
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

// Start the Fastify server
(async () => {
  try {
    await app.listen({ port: 3015 });
    console.log(`Server listening on port 3015`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
