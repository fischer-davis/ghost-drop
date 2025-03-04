import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@web/server/api/root";
import axios from "axios";
import superjson from "superjson";
import * as tus from "tus-js-client";
import { createProgressBar } from "./progressBar";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3015/files/";
const CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB

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

export async function uploadFile(filePath: string) {
  const file = Bun.file(filePath);

  const progressBar = createProgressBar();

  const upload = new tus.Upload(file, {
    endpoint: API_BASE_URL,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    chunkSize: CHUNK_SIZE,
    metadata: {
      filename: file.name ?? "unknown",
      filetype: file.type,
    },
    onError: function (error) {
      console.log("Failed because: " + error);
    },
    onBeforeRequest: function (req) {
      progressBar.start();
    },
    onProgress: function (bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      progressBar.update(Number(percentage), "uploading");
    },
    onSuccess: function () {
      progressBar.finish();
    },
  });

  // Check if there are any previous uploads to continue.
  upload.findPreviousUploads().then(function (previousUploads) {
    // Found previous uploads so we select the first one.
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    // Start the upload
    upload.start();
  });
}

export async function downloadFile(fileId: string) {
  const response = await axios.get(`${API_BASE_URL}/${fileId}`, {
    responseType: "blob",
  });

  // Write the downloaded data to a file
  await Bun.write(fileId, response.data);
}

export async function deleteFiles(fileId: string) {
  const response = await axios.delete(`${API_BASE_URL}/${fileId}`);
  return response.data;
}

export async function listFiles() {
  return await trpc.file.getUploadedFiles.query();
}
