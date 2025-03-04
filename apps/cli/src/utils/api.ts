import { formatBytes } from "@cli/utils/formatBytes"; // Assuming you have a progress bar function
import axios from "axios";
import { createProgressBar } from "./progressBar";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB

export async function uploadFile(filePath: string) {
  const fileStats = await Bun.file(filePath).stat();
  const fileSize = fileStats.size;
  const fileName = filePath.split("/").pop() || "unknown";

  if (fileSize > CHUNK_SIZE) {
    // Chunk-based upload
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    const progressBar = createProgressBar();
    let startTime = Date.now();
    let uploadedBytes = 0;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = await Bun.file(filePath).slice(start, end).arrayBuffer();

      const formData = new FormData();
      formData.append("file", new Blob([chunk]), fileName);
      formData.append("chunkIndex", chunkIndex.toString());
      formData.append("totalChunks", totalChunks.toString());
      formData.append("originalFilename", fileName);

      try {
        await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 0;
            const loaded = progressEvent.loaded || 0;
            uploadedBytes += loaded - (uploadedBytes || 0);
            const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);

            const elapsedTime = (Date.now() - startTime) / 1000;
            const speed = uploadedBytes / elapsedTime;
            const formattedSpeed = formatBytes(speed);

            progressBar.update(progress, formattedSpeed);
          },
        });
      } catch (error) {
        console.error("Error uploading chunk:", error);
        throw error;
      }
    }

    progressBar.finish();
  } else {
    // Regular upload
    const formData = new FormData();
    formData.append("file", Bun.file(filePath), fileName);

    const progressBar = createProgressBar();
    let startTime = Date.now();
    let uploadedBytes = 0;

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const loaded = progressEvent.loaded || 0;
          uploadedBytes += loaded - (uploadedBytes || 0);
          const progress = Math.round((loaded / total) * 100);

          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = uploadedBytes / elapsedTime;
          const formattedSpeed = formatBytes(speed);

          progressBar.update(progress, formattedSpeed);
        },
      });

      progressBar.finish();
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

export async function downloadFile(fileId: string) {
  const response = await axios.get(`${API_BASE_URL}/download?file=${fileId}`, {
    responseType: "blob",
  });

  // Write the downloaded data to a file
  await Bun.write(fileId, response.data);
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
