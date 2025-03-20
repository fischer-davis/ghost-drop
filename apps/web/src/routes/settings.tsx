import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
    component: Settings,
  });
  
  function Settings() {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            <h1>Settings</h1>
        </div>
      </div>
    );
  }