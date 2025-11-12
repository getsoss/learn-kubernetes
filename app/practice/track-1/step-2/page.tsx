"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track1Step2Page() {
  const steps = [
    { index: 1, label: "컨테이너와 Pod 개념" },
    { index: 2, label: "kubectl 기초" },
    { index: 3, label: "Pod 생성/확인" },
    { index: 4, label: "로그/디버깅" },
    { index: 5, label: "정리/퀴즈" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <TrackStepper trackId="track-1" steps={steps} currentStep={2} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            kubectl 기초: 컨텍스트와 네임스페이스
          </h1>
          <p className="text-gray-700 mb-4">
            실수의 8할은 컨텍스트/네임스페이스 오인에서 시작합니다. 안전한
            습관을 먼저 잡으세요.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl config get-contexts</div>
            <div>$ kubectl config use-context &lt;your-context&gt;</div>
            <div>$ kubectl config set-context --current --namespace=dev</div>
            <div>$ kubectl get pods -n dev</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              베스트 프랙티스
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                파괴적 명령 전에는{" "}
                <span className="font-mono">--dry-run=client -o yaml</span>로
                출력 확인
              </li>
              <li>프로덕션/스테이징 컨텍스트를 쉘 프롬프트에 표시</li>
              <li>네임스페이스를 현재 컨텍스트에 고정하여 오입력 방지</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
