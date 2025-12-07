"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track2Step3Page() {
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
          <TrackStepper trackId="track-2" steps={steps} currentStep={3} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            롤링 업데이트
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>
              $ kubectl set image deployment/myapp nginx=nginx:1.25 --record
            </div>
            <div>$ kubectl rollout status deployment/myapp</div>
            <div>$ kubectl rollout history deployment/myapp</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              전략 파라미터
            </h2>
            <p className="text-gray-700 text-sm">
              maxSurge / maxUnavailable를 트래픽 패턴에 맞게 조정하세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
