"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track4Step2Page() {
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
        <div className="max-w-5xl mx-auto">
          <TrackStepper trackId="track-4" steps={steps} currentStep={2} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Volume / PVC
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl apply -f pvc.yaml</div>
            <div>$ kubectl describe pvc</div>
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
