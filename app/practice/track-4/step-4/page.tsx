"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track4Step4Page() {
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
          <TrackStepper trackId="track-4" steps={steps} currentStep={4} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">보안 고려</h1>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 bg-white rounded-xl border border-gray-200 p-4">
            <li>Secret은 at-rest 암호화와 RBAC로 보호</li>
            <li>민감정보는 환경변수 대신 파일 마운트 권장</li>
            <li>PodSecurity/PSaR 정책으로 마운트 경계 수립</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
