import SignUpForm from "@web/components/signup-form";
import { getServerAuthSession } from "@web/server/auth/config";
import { redirect } from "next/navigation";
import React from "react";

const SignUp = async () => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/home");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
