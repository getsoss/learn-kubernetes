"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";

const HelpPage = dynamic(() => import("../components/HelpPage"), {
  ssr: false,
});

export default function HelpPageRoute() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <HelpPage />
      </div>
    </div>
  );
}
