import { useTRPC } from "@/utils/trpc.ts";
import { Button } from "@heroui/button";
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

  console.log(data);
  return (
    <div className="p-2">
      Home
      <Button variant="solid" color={"warning"}>
        Click
      </Button>
    </div>
  );
}
