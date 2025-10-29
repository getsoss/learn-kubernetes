"use client";

import Header from "../../../components/Header";
import TrackStepper from "../../components/TrackStepper";

export default function Track2Step5Page() {
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
          <TrackStepper trackId="track-2" steps={steps} currentStep={5} />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            YAML 베스트 프랙티스
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                라벨/어노테이션 표준화:{" "}
                <span className="font-mono">app, version, env</span>
              </li>
              <li>프로브/리소스 요청/제한 필수</li>
              <li>Immutable 태그 지양, 다이제스트/명시 버전 사용</li>
              <li>
                Config 분리: <span className="font-mono">ConfigMap/Secret</span>
                로 주입
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
