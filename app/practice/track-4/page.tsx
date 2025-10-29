"use client";

import Link from "next/link";
import Header from "../../components/Header";

export default function Track4Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track 4. 스토리지 & 설정 관리
          </h1>
          <p className="text-gray-600 mb-6">데이터 유지 및 환경 설정 주입</p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">목표</h2>
            <p className="text-gray-700">
              ConfigMap, Secret, Volume의 차이를 이해하고 사용할 수 있다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              실습 예시
            </h2>
            <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-gray-200">
              <div>
                $ kubectl create configmap app-config --from-literal=ENV=prod
              </div>
              <div>
                $ kubectl create secret generic db-secret
                --from-literal=PASSWORD=pass
              </div>
              <div>$ kubectl apply -f pvc.yaml</div>
              <div>$ kubectl describe pvc</div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              터미널에서 직접 실행하세요.{" "}
              <Link className="text-blue-600 hover:underline" href="/terminal">
                /terminal
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              확장 과제
            </h2>
            <p className="text-gray-700">
              Nginx 설정파일을 ConfigMap으로 관리해보세요.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
