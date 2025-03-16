import { Button } from "@heroui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // const filesQuery = useQuery(trpc.file.getUploadedFiles.queryOptions());
  //
  // const files = filesQuery.data || [];
  // console.log(files);
  return (
    <div className="p-2">
      Home
      <Button variant="solid" color={"warning"}>
        Click
      </Button>
    </div>
  );
}
