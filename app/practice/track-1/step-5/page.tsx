"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track1Step5Page() {
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
          <TrackStepper trackId="track-1" steps={steps} currentStep={5} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            정리 및 퀴즈
          </h1>
          <p className="text-gray-700 mb-4">
            핵심 개념을 점검하고 다음 트랙 준비를 마칩니다.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">요약</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Pod는 스케줄링 단위이자 관찰/디버깅의 첫 단위</li>
              <li>컨텍스트/네임스페이스 관리가 안전 운용의 출발점</li>
              <li>기본 명령으로 상태/로그/이벤트를 읽는 습관</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              간단 퀴즈
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>동일 Pod의 두 컨테이너가 통신할 때 사용하는 주소는?</li>
              <li>현재 컨텍스트의 네임스페이스를 dev로 고정하는 명령은?</li>
              <li>Pod가 CrashLoopBackOff일 때 가장 먼저 확인할 것은?</li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">
              답안을 실습으로 검증하세요:{" "}
              <Link className="text-blue-600 hover:underline" href="/terminal">
                /terminal
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
