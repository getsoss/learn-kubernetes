"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track4Step3Page() {
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
          <TrackStepper trackId="track-4" steps={steps} currentStep={3} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">마운트 패턴</h1>
          <p className="text-gray-700">
            env, args, volumeMounts를 적절히 조합해 12-Factor 구성 원칙을
            지킵니다.
          </p>
        </div>
      </main>
    </div>
  );
}
