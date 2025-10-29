"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track4Step5Page() {
  const steps = [
    { index: 1, label: "ConfigMap/Secret" },
    { index: 2, label: "Volume/PVC" },
    { index: 3, label: "마운트 패턴" },
    { index: 4, label: "보안 고려" },
    { index: 5, label: "사례/정리" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <TrackStepper trackId="track-4" steps={steps} currentStep={5} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">사례/정리</h1>
          <p className="text-gray-700 mb-4">
            Nginx 설정을 ConfigMap으로 관리하는 패턴을 예시로 정리합니다.
          </p>
          <p className="text-sm text-gray-600">
            실습은{" "}
            <Link className="text-blue-600 hover:underline" href="/terminal">
              /terminal
            </Link>
            에서 진행하세요.
          </p>
        </div>
      </main>
    </div>
  );
}
