"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track1Step3Page() {
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
          <TrackStepper trackId="track-1" steps={steps} currentStep={3} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pod 생성과 상태 확인
          </h1>
          <p className="text-gray-700 mb-4">
            가장 빠른 실습 루프를 경험해 봅시다.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl run nginx --image=nginx</div>
            <div>$ kubectl get pods -w</div>
            <div>$ kubectl describe pod nginx</div>
            <div>$ kubectl delete pod nginx</div>
            <div>$ kubectl run nginx --image=nginx --port=80</div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            터미널에서 직접 실행하세요.{" "}
            <Link className="text-blue-600 hover:underline" href="/terminal">
              /terminal
            </Link>
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              체크리스트
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Pod 상태가 <span className="font-mono">Running</span> 인가?
              </li>
              <li>
                <span className="font-mono">describe</span> 이벤트에 이미지 풀
                에러가 없는가?
              </li>
              <li>재생성 시 이름 충돌을 피했는가?</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
