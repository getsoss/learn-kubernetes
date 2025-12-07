"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track5Step4Page() {
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
          <TrackStepper trackId="track-5" steps={steps} currentStep={4} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Helm 배포</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>
              $ helm repo add bitnami https://charts.bitnami.com/bitnami
            </div>
            <div>$ helm install redis bitnami/redis</div>
            <div>$ helm upgrade --install myapp ./chart</div>
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
