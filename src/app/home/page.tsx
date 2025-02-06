import React from "react";
import { getServerAuthSession } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import FileUpload from "@/components/file-upload";
import FileUploadProgress from "@/components/file-upload-progress";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <Navbar/>
      <div className="max-w-lg mx-auto mt-10">
        <h1 className="text-xl font-semibold mb-4">Upload a File</h1>
        <FileUpload/>
        <FileUploadProgress/>
      </div>
    </>
  )
};

export default HomePage;
