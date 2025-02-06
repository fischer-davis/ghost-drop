"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function FileUploadProgress() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === "progress") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setProgress(data.progress);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Live Upload Progress</h2>
      <Progress value={progress} className="h-2 w-full bg-gray-200 mt-2" />
      <p className="text-sm mt-1">{progress}%</p>
    </div>
  );
}
