import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/globals.css";
import { createRouter } from "@/router.tsx";
import { HeroUIProvider } from "@heroui/system";
import { RouterProvider } from "@tanstack/react-router";

const router = createRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </React.StrictMode>,
);
