"use client";

import Link from "next/link";
import Header from "../components/Header";

const tracks = [
  {
    id: "track-1",
    title: "Track 1. 쿠버네티스 기초 입문",
    subtitle: "쿠버네티스를 사용해보는 첫 감각",
    goal: "CLI로 Pod를 생성하고 상태를 확인할 수 있다.",
  },
  {
    id: "track-2",
    title: "Track 2. 워크로드 관리",
    subtitle: "배포/확장/롤백 경험",
    goal: "Deployment로 애플리케이션을 배포하고 업데이트할 수 있다.",
  },
  {
    id: "track-3",
    title: "Track 3. 네트워킹 & 서비스 연결",
    subtitle: "왜 접속이 안 되는지 이해하기",
    goal: "쿠버네티스의 네트워크 추상화를 이해한다.",
  },
  {
    id: "track-4",
    title: "Track 4. 스토리지 & 설정 관리",
    subtitle: "데이터 유지와 설정 주입",
    goal: "ConfigMap, Secret, Volume의 차이를 이해하고 사용할 수 있다.",
  },
  {
    id: "track-5",
    title: "Track 5. 고급 운영 실습",
    subtitle: "장애/최적화/Helm 배포",
    goal: "장애 파악, 리소스 최적화, Helm 차트 배포 경험.",
  },
];

export default function PracticeIndexPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            실습 트랙 선택
          </h1>
          <p className="text-gray-600 mb-6">
            아래 트랙 중 하나를 선택해 단계별 실습을 진행하세요.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracks.map((t) => (
              <Link
                key={t.id}
                href={`/practice/${t.id}`}
                className="block border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    {t.title}
                  </div>
                  <div className="text-gray-900 font-semibold text-lg mb-1">
                    {t.subtitle}
                  </div>
                  <div className="text-sm text-gray-600">목표: {t.goal}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
