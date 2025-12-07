"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track1Step4Page() {
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
        <div className="max-w-5xl mx-auto">
          <TrackStepper trackId="track-1" steps={steps} currentStep={4} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그/디버깅: 관찰 가능성
          </h1>
          <p className="text-gray-700 mb-4">
            로그와 이벤트로 문제를 좁혀가는 훈련을 합니다.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 font-mono text-sm space-y-1">
            <div>$ kubectl logs nginx</div>
            <div>$ kubectl logs -f nginx</div>
            <div>$ kubectl exec -it nginx -- sh</div>
            <div>$ kubectl describe pod nginx</div>
            <div>$ kubectl get events --sort-by=.lastTimestamp</div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            터미널에서 직접 실행하세요.{" "}
            <Link className="text-blue-600 hover:underline" href="/terminal">
              /terminal
            </Link>
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              디버깅 팁
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>컨테이너 시작 실패는 대개 이미지/커맨드/리소스 리밋 이슈</li>
              <li>
                CrashLoopBackOff는{" "}
                <span className="font-mono">logs --previous</span>로 초기 로그
                확인
              </li>
              <li>노드 이슈는 이벤트/스케줄링 실패 메시지로 추적</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
