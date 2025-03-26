import DataGrid from "@/components/data-grid.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-4">
      <DataGrid />
    </div>
  );
}
