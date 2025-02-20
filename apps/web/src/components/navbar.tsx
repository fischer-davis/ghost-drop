"use client";

import * as React from "react";
import Link from "next/link";
import { UserDropDown } from "@web/components/user-dropdown";
import FileUploadProgress from "@web/components/file-upload-progress";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-bold">Ghost Drop</h1>
            </Link>
          </div>
          <FileUploadProgress />
          <div className="flex justify-center">
            <div>
              <UserDropDown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
