"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track5Step1Page() {
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
        <div className="max-w-4xl mx-auto">
          <TrackStepper trackId="track-5" steps={steps} currentStep={1} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            운영 시나리오 개요
          </h1>
          <p className="text-gray-700">
            실서비스에서 자주 만나는 문제와 해결 루틴을 소개합니다.
          </p>
        </div>
      </main>
    </div>
  );
}
