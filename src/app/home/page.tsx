import React from "react";
import { getServerAuthSession } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/signin");
  }
  return (
    <>
      <Navbar />
    </>
  );
};

export default HomePage;
