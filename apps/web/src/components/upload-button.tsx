import { useProgress } from "@/stores/useProgress.ts";
import { useTRPC } from "@/utils/trpc.ts";
import { Button } from "@heroui/button";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { useRef } from "react";
import * as tus from "tus-js-client";

const serverPort = import.meta.env.VITE_SERVER_PORT || 3000;

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { setProgress, setUploading } = useProgress();
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endpoint: `http://localhost:${serverPort}/files`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onBeforeRequest: function () {
        setUploading(true);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
        setProgress(Number(percentage));
      },
      onSuccess: function () {
        setUploading(false);
        setProgress(0);
        queryClient.invalidateQueries({
          queryKey: trpc.file.getUploadedFiles.queryKey(),
        });
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      console.log("upload");

      // Start the upload
      upload.start();
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <>
      <VisuallyHidden>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleUpload}
        />
      </VisuallyHidden>
      <Button
        color="primary"
        endContent={<Plus size={20} />}
        onPress={handleClick}
      >
        Upload File
      </Button>
    </>
  );
};

export default Upload;
