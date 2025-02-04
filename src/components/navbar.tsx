"use client";

import * as React from "react";
import Link from "next/link";
import { UserDropDown } from "@/components/user-dropdown";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">Logo</span>
            </Link>
          </div>
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
