import React from "react";
import { getServerAuthSession } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import DataView from "@/components/data-view";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto p-6">
        <DataView />
      </div>
    </>
  );
};

export default HomePage;
