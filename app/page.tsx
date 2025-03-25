"use client"; // 클라이언트 전용 코드로 표시

import dynamic from "next/dynamic";
import "./globals.css";

// 클라이언트 사이드에서만 로드되도록 설정
const Terminal = dynamic(() => import("../app/components/Terminal"), {
  ssr: false,
});

export default function TerminalPage() {
  return (
    <div className="bg-blue-100 h-screen w-screen p-4">
      <Terminal />
    </div>
  );
}
