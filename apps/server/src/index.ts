import { createTRPCClient, httpBatchLink, httpLink } from "@trpc/client";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import fastify from "fastify";
import superjson from "superjson";
import { AppRouter } from "../../web/src/server/api/root";

const app = fastify({ logger: true });

// Setup tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: superjson,
      maxURLLength: 14000,
    }),
  ],
});

// Setup TUS server
const tusServer = new Server({
  path: "/files",
  onUploadFinish: async (req, res, file) => {
    try {
      console.log("File uploaded");
      const response = await trpc.file.saveFileMetadata.mutate({
        id: file.id, // assuming you want to store the file ID
        name: file.metadata?.filename || "unknown", // extract filename if available
        size: file.size,
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
  .listen({ port: 3015 })
  .then(() => {
    console.log(`Server listening on port 3015`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
