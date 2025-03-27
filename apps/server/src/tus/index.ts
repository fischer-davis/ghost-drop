import { db } from "@server/db";
import { appRouter } from "@server/trpc/root";
import { createCallerFactory } from "@server/trpc/trpc";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";

const caller = createCallerFactory(appRouter)({
  req: { ip: "server" }, // Provide the actual request object
  db, // Provide the database instance
});

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

const registerTusServer = (app: any) => {
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
};

export default registerTusServer;
