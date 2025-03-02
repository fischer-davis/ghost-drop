// Define the upload directory for storing file chunks
import path from "path";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";

const uploadDir = path.join(process.cwd(), "dev");

console.log(uploadDir);

// Initialize the Tus server
const tusServer = new Server({
  path: "/api/upload", // Base path
  datastore: new FileStore({ directory: uploadDir }),
});

export default tusServer;
