"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track1Step1Page() {
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
          <TrackStepper trackId="track-1" steps={steps} currentStep={1} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            컨테이너와 Pod: 왜 Pod인가?
          </h1>
          <p className="text-gray-700 mb-4">
            컨테이너는 프로세스를 격리하는 최소 단위이고, 쿠버네티스는
            컨테이너를 <span className="font-semibold">Pod</span>라는 스케줄링
            단위로 묶어 다룹니다. 사이드카, 로깅/프록시 등 보조 컨테이너를 함께
            배치하기 위해서입니다.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              핵심 포인트
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Pod는 동일 노드에서 공유 네트워크 네임스페이스를 사용합니다.
              </li>
              <li>
                동일 Pod 내 컨테이너는{" "}
                <span className="font-mono">localhost</span>로 통신합니다.
              </li>
              <li>
                Pod는 불변/휘발에 가깝고, 재시작 시 IP가 바뀔 수 있습니다.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              권장 읽기
            </h2>
            <p className="text-sm text-gray-700">
              Pod 설계의 이유를 이해하면 이후 Deployment/Service 설계가
              자연스럽습니다. Pod 수명 주기와 재스케줄링을 염두에 두고 리소스를
              설계하세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
