import { authClient } from "@/lib/auth-client.ts";
import { zSignInSchema } from "@/utils/utils.ts";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { useForm } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const SIGNIN_FAILED = "Incorrect email or password";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onChange: zSignInSchema,
    },
    onSubmit: async ({ value }) => {
      return await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: "/",
          rememberMe: value.rememberMe,
        },
        {
          onRequest: () => {
            setError("");
          },
          onSuccess: () => {
            router.navigate({ to: "/" });
          },
          onError: (error) => {
            if (error instanceof Error) {
              setError(SIGNIN_FAILED);
            } else {
              setError(error.error.message);
            }
          },
        },
      );
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md" disableRipple>
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-sm text-default-500">
            Enter your email below to login to your account
          </p>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="email"
              children={(field) => (
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
                    !z.string().email().safeParse(field.state.value).success
                      ? true
                      : false
                  }
                  errorMessage="Invalid email"
                  isRequired
                />
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <Input
                  label="Password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Enter your password"
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
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
                  isRequired
                />
              )}
            />
            <div className="flex items-center justify-between">
              <form.Field
                name="rememberMe"
                children={(field) => (
                  <Checkbox
                    size="sm"
                    isSelected={field.state.value}
                    onValueChange={(checked) => field.handleChange(checked)}
                  >
                    Remember me
                  </Checkbox>
                )}
              />
              {/*<Link to="/" className="text-primary">*/}
              {/*  Forgot password?*/}
              {/*</Link>*/}
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <Button type="submit" color="primary" className="w-full" size="lg">
              Sign in
            </Button>
            <p className="text-center text-sm text-default-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary">
                Sign up
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
