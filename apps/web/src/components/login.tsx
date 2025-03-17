import { authClient } from "@/lib/auth-client.ts";
import { signInSchema } from "@/utils/utils.ts";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SIGNIN_FAILED = "Incorrect email or password";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = form.handleSubmit(async (value) => {
    return await authClient.signIn.email(
      {
        ...value,
        callbackURL: "/home",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: value.rememberMe === "true",
      },
      {
        onRequest: () => {
          setError("");
        },
        onSuccess: () => {
          // Redirect to home screen after login.
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
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              type="email"
              isRequired
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              type="password"
              isRequired
            />
            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={rememberMe}
                onValueChange={setRememberMe}
                size="sm"
              >
                Remember me
              </Checkbox>
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
