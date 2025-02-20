import DataView from "@web/components/data-view";
import { Navbar } from "@web/components/navbar";
import { getServerAuthSession } from "@web/server/auth/config";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto p-4">
        <DataView />
      </div>
    </>
  );
};

export default HomePage;
