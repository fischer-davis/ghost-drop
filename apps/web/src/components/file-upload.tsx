import { Button } from "@web/components/ui/button";
import { Icons } from "@web/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { useProgress } from "@web/stores/useProgress";
import { api } from "@web/trpc/trpc";
import { useRef } from "react";
import * as tus from "tus-js-client";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setProgress } = useProgress();
  const utils = api.useUtils();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endpoint: "http://localhost:3015/files",
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
        setProgress(Number(percentage));
      },
      onSuccess: function () {
        if ("name" in upload.file) {
          console.log("Download %s from %s", upload.file.name, upload.url);
        }
        setProgress(0);
        utils.file.invalidate();
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" onClick={handleClick}>
              <Icons.upload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
