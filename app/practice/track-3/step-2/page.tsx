"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track3Step2Page() {
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
        <div className="max-w-4xl mx-auto">
          <TrackStepper trackId="track-3" steps={steps} currentStep={2} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ClusterIP / NodePort
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>
              $ kubectl expose deployment myapp --port=80 --target-port=80
            </div>
            <div>$ kubectl create service nodeport myapp-node --tcp=80:80</div>
            <div>$ kubectl get svc myapp-node -o yaml</div>
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
