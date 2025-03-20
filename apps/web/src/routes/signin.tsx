import Login from "@/components/login.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <VisuallyHidden>
        <ThemeSwitch />
      </VisuallyHidden>
      <div className="w-full max-w-sm">
        <Login />
      </div>
    </div>
  );
}
