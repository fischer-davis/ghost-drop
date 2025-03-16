import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Link, useRouter } from "@tanstack/react-router";
import React from "react";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password, rememberMe });
  };

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
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              <Link href="#" size="sm" className="text-primary">
                Forgot password?
              </Link>
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
