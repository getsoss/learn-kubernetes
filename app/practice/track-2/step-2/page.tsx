"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track2Step2Page() {
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
        <div className="max-w-5xl mx-auto">
          <TrackStepper trackId="track-2" steps={steps} currentStep={2} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            배포와 스케일링
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl create deployment myapp --image=nginx</div>
            <div>$ kubectl get deploy,rs,pods</div>
            <div>$ kubectl scale deployment myapp --replicas=3</div>
          </div>
          <p className="text-sm text-gray-600">
            터미널 실습:{" "}
            <Link className="text-blue-600 hover:underline" href="/terminal">
              /terminal
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
