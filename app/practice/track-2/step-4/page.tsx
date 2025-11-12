"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track2Step4Page() {
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
          <TrackStepper trackId="track-2" steps={steps} currentStep={4} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">롤백 전략</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl rollout undo deployment/myapp</div>
            <div>$ kubectl rollout undo deployment/myapp --to-revision=2</div>
            <div>$ kubectl rollout history deployment/myapp</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              안전 가이드
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>프로브(ready/liveness)로 안전한 배포 한계 확보</li>
              <li>카나리/블루그린은 서비스 라우팅 전략과 함께 고려</li>
              <li>오브저버빌리티 지표로 승인 조건을 자동화</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
