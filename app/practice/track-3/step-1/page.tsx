"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track3Step1Page() {
  const steps = [
    { index: 1, label: "Service 개념" },
    { index: 2, label: "ClusterIP/NodePort" },
    { index: 3, label: "Ingress 기초" },
    { index: 4, label: "문제해결 패턴" },
    { index: 5, label: "아키텍처 정리" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <TrackStepper trackId="track-3" steps={steps} currentStep={1} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Service 개념
          </h1>
          <p className="text-gray-700">
            Pod의 IP는 변합니다. 안정적 엔드포인트를 제공하기 위한 추상화가
            Service입니다.
          </p>
        </div>
      </main>
    </div>
  );
}
