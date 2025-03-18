import DataGrid from "@/components/data-grid.tsx";
import FileUploader from "@/components/file-upload.tsx";
import { useTRPC } from "@/utils/trpc.ts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const trpc = useTRPC();
  const { data = [], isLoading } = useQuery(
    trpc.file.getUploadedFiles.queryOptions(),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 h-screen">
      <DataGrid />
    </div>
  );
}
