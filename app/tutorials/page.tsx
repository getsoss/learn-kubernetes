"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";

const TutorialsPage = dynamic(() => import("../components/TutorialsPage"), {
  ssr: false,
});

export default function TutorialsPageRoute() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <TutorialsPage />
      </div>
    </div>
  );
}
