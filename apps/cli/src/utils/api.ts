import { formatBytes } from "@cli/utils/formatBytes"; // Assuming you have a progress bar function
import axios from "axios";
import { createProgressBar } from "./progressBar";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

export async function uploadFile(filePath: string) {
  const formData = new FormData();
  formData.append("file", Bun.file(filePath));

  // Create a progress bar
  const progressBar = createProgressBar();
  let startTime = Date.now(); // Start time for speed calculation
  let uploadedBytes = 0;

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total || 0;
      const loaded = progressEvent.loaded || 0;
      uploadedBytes += loaded - (uploadedBytes || 0); // Update the uploaded bytes
      const progress = Math.round((loaded / total) * 100);

      // Calculate speed
      const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
      const speed = uploadedBytes / elapsedTime; // Bytes per second
      const formattedSpeed = formatBytes(speed); // Format speed

      // Update the progress bar with speed
      progressBar.update(progress, formattedSpeed);
    },
  });

  progressBar.finish(); // Finish the progress bar when upload is complete
  return response.data;
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
