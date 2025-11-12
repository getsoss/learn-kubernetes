"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track2Step1Page() {
  const steps = [
    { index: 1, label: "Deployment 개념" },
    { index: 2, label: "배포/스케일링" },
    { index: 3, label: "롤링 업데이트" },
    { index: 4, label: "롤백 전략" },
    { index: 5, label: "YAML 베스트프랙티스" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <TrackStepper trackId="track-2" steps={steps} currentStep={1} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            왜 Deployment인가?
          </h1>
          <p className="text-gray-700 mb-4">
            ReplicaSet을 추상화하고 선언적 업데이트를 보장하는 상위
            리소스입니다.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              핵심 개념
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Deployment → ReplicaSet → Pod 계층 구조</li>
              <li>선언적 스펙으로 롤링 업데이트, 파즈 전략 제어</li>
              <li>
                히스토리 저장:{" "}
                <span className="font-mono">kubectl rollout history</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            실습은 다음 단계에서 진행합니다.{" "}
            <Link className="text-blue-600 hover:underline" href="/terminal">
              /terminal
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
