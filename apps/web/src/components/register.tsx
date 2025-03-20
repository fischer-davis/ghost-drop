import { authClient } from "@/lib/auth-client.ts";
import { zSignUpSchema } from "@/utils/utils.ts";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { useForm } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: zSignUpSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
    },
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => {
              return (
                <Input
                  label="Name"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter your name"
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  isRequired
                />
              );
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              return (
                <Input
                  label="Email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter your email"
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  isInvalid={
                    field.state.value &&
                    !z.string().email().safeParse(field.state.value)
                      ? true
                      : false
                  }
                  errorMessage="Invalid email"
                  isRequired
                />
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              return (
                <Input
                  label="Password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter your password"
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
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
              );
            }}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => {
              return (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  isRequired
                  isInvalid={
                    field.state.value &&
                    field.state.value !== form.getFieldValue("password")
                      ? true
                      : false
                  }
                  errorMessage={
                    field.state.value &&
                    field.state.value !== form.getFieldValue("password")
                      ? "Passwords do not match"
                      : ""
                  }
                  type={isVisible ? "text" : "password"}
                />
              );
            }}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit}
                color="primary"
                className="w-full"
              >
                {isSubmitting ? "..." : "Sign Up"}
              </Button>
            )}
          />
        </form>
        <div className="text-center text-sm text-default-500">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
