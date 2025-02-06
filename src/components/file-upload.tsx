"use client";

import { useState } from "react";
import {Button} from "@/components/ui/button";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setUploadSuccess(true);
    } else {
      setUploadSuccess(false);
    }

    setUploading(false);
  };

  return (
    <div className="rounded-lg border p-4 shadow-md">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {/* Upload result */}
      {uploadSuccess !== null && (
        <p
          className={`mt-2 ${
            uploadSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {uploadSuccess ? "Upload Successful!" : "Upload Failed!"}
        </p>
      )}
    </div>
  );
}
