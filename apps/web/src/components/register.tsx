import { authClient } from "@/lib/auth-client.ts";
import { zSignUpSchema } from "@/utils/utils.ts";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof zSignUpSchema>>({
    resolver: zodResolver(zSignUpSchema),
  });

  const handleSubmit = form.handleSubmit(async (value) => {
    await authClient.signUp.email(
      {
        ...value,
        callbackURL: "/dashboard", // a url to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: () => {
          //show loading
        },
        onSuccess: () => {
          // Redirect to home screen after signup.
          router.navigate({ to: "/" });
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      },
    );
  });

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-default-500">Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onValueChange={(value) =>
              setFormData({ ...formData, email: value })
            }
            isRequired
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onValueChange={(value) =>
              setFormData({ ...formData, password: value })
            }
            isRequired
            validate={validatePassword}
            type={isVisible ? "text" : "password"}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Eye size={20} className="text-default-400" />
                ) : (
                  <EyeOff size={20} className="text-default-400" />
                )}
              </button>
            }
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onValueChange={(value) =>
              setFormData({ ...formData, confirmPassword: value })
            }
            isRequired
            isInvalid={
              !!(
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
              )
            }
            errorMessage={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "Passwords do not match"
                : ""
            }
            type={isVisible ? "text" : "password"}
          />
          <Button type="submit" color="primary" className="w-full">
            Sign Up
          </Button>
        </form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="#" color="primary">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
