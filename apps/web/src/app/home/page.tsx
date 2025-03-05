"use client";

import DataView from "@web/components/data-view";
import { Navbar } from "@web/components/navbar";
import React from "react";

const HomePage = () => {
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
