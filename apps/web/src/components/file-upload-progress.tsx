import { Progress } from "@web/components/ui/progress";
import { useProgress } from "@web/stores/useProgress";

function formatSpeed(speed: number): string {
  if (speed < 1024) {
    return `${speed.toFixed(2)} KB/s`;
  } else if (speed < 1024 * 1024) {
    return `${(speed / 1024).toFixed(2)} MB/s`;
  } else {
    return `${(speed / (1024 * 1024)).toFixed(2)} GB/s`;
  }
}

export default function FileUploadProgress() {
  const { progress, uploading, speed } = useProgress();
  console.log(progress);
  return (
    <>
      {uploading ? (
        <div className="flex w-80 items-center gap-2">
          <Progress value={progress} />
          <p className="text-sm">{progress}%</p>
          {/*<p className="text-sm">{formatSpeed(speed)}</p>*/}
        </div>
      ) : null}
    </>
  );
}
