"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";

const TerminalComponent = dynamic(() => import("../components/Terminal"), {
  ssr: false,
});

export default function TerminalPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <TerminalComponent />
      </div>
    </div>
  );
}
