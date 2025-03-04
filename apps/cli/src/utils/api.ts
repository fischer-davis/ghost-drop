import axios from "axios";
import chalk from "chalk";
import * as tus from "tus-js-client";
import { createProgressBar } from "./progressBar";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3015/files/";
const CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB

export async function uploadFile(filePath: string) {
  const file = Bun.file(filePath);
  const buffer = await file.arrayBuffer();

  const progressBar = createProgressBar();

  progressBar.before(file.name ?? "unknown");

  const upload = new tus.Upload(Buffer.from(buffer), {
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
    onProgress: function (bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      progressBar.update(Number(percentage), "uploading");
    },
    onSuccess: function () {
      progressBar.update(100, "Complete");
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
  const progressBar = createProgressBar();
  progressBar.before(fileId);

  const response = await axios.get(`${API_BASE_URL}${fileId}`, {
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      const total = progressEvent.total ?? 0;
      const current = progressEvent.loaded;
      const percentage = ((current / total) * 100).toFixed(2);
      progressBar.update(Number(percentage), "downloading");
    },
  });

  // Write the downloaded data to a file
  await Bun.write(fileId, response.data);

  progressBar.update(100, "Complete");
  progressBar.finish();
}

export async function deleteFiles(fileId: string) {
  const response = await axios.delete(`${API_BASE_URL}/api/delete/${fileId}`);
  return response.data;
}

export async function listFiles() {
  const response = await axios.get(
    `${API_BASE_URL}/trpc/file.getUploadedFiles`,
  );
  return response.data;
}
