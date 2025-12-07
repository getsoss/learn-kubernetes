"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track5Step5Page() {
  const steps = [
    { index: 1, label: "운영 시나리오 개요" },
    { index: 2, label: "CrashLoopBackOff" },
    { index: 3, label: "리소스 최적화" },
    { index: 4, label: "Helm 배포" },
    { index: 5, label: "디버깅 툴킷" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <TrackStepper trackId="track-5" steps={steps} currentStep={5} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">디버깅 툴킷</h1>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 bg-white rounded-xl border border-gray-200 p-4">
            <li>kubectl describe / events</li>
            <li>stern / k9s / lens</li>
            <li>프로파일링/트레이싱: eBPF, OpenTelemetry</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
