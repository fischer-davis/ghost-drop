import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

export async function uploadFile(filePath: string) {
  const formData = new FormData();
  formData.append("file", Bun.file(filePath));

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function downloadFile(fileId: string) {
  const response = await axios.get(`${API_BASE_URL}/download/${fileId}`, {
    responseType: "blob",
  });

  await Bun.write(fileId, response.data);
}

export async function deleteFiles(fileId: string) {
  const response = await axios.delete(`${API_BASE_URL}/api/delete/${fileId}`);
  return response.data;
}

export async function listFiles() {
  const response = await axios.get(`${API_BASE_URL}/api/list`);
  return response.data;
}
