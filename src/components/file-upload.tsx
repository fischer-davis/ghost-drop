import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProgress } from "@/stores/useProgress";
import { api } from "@/trpc/trpc";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setProgress, setUploading, setSpeed } = useProgress();
  const utils = api.useUtils();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    Array.from(e.target.files!).forEach((file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      let startTime = Date.now();
      let uploadedBytes = 0;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);

          const currentTime = Date.now();
          const elapsedTime = (currentTime - startTime) / 1000; // in seconds
          const bytesUploaded = event.loaded - uploadedBytes;
          const speed = bytesUploaded / elapsedTime / 1024; // in KB/s
          setSpeed(speed);

          startTime = currentTime;
          uploadedBytes = event.loaded;
        }
      };

      xhr.onload = async () => {
        setUploading(false);
        if (xhr.status === 200) {
          setProgress(100);
          await utils.file.invalidate(); // Invalidate the cache for the files query
        } else {
          setProgress(0);
        }
        setSpeed(0);
      };

      xhr.onerror = () => {
        setProgress(0);
        setUploading(false);
        setSpeed(0);
      };

      xhr.send(formData);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
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
