import { useProgress } from "@/stores/useProgress.ts";
import { useTRPC } from "@/utils/trpc.ts";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useRef } from "react";
import * as tus from "tus-js-client";

const serverPort = import.meta.env.VITE_SERVER_PORT || 3000;

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setProgress, setUploading } = useProgress();
  const trpc = useTRPC();
  const queryKey = trpc.file.getUploadedFiles.queryKey();
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries({ queryKey });
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
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <Tooltip content="Upload">
        <Button size="sm" onPress={handleClick}>
          <Upload />
        </Button>
      </Tooltip>
    </>
  );
}
