"use client";

import Link from "next/link";
import Header from "../../components/Header";

export default function Track3Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track 3. 네트워킹 & 서비스 연결
          </h1>
          <p className="text-gray-600 mb-6">
            Pod는 있는데 왜 접속이 안될까를 이해하기
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">목표</h2>
            <p className="text-gray-700">
              쿠버네티스의 네트워크 추상화를 이해한다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              실습 예시
            </h2>
            <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-gray-200">
              <div>
                $ kubectl expose deployment myapp --port=80 --target-port=80
              </div>
              <div>$ kubectl get svc</div>
              <div>
                $ kubectl create service nodeport myapp-node --tcp=80:80
              </div>
              <div>$ kubectl get svc myapp-node -o yaml</div>
              <div>$ kubectl describe svc myapp-node</div>
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
              시각화 아이디어
            </h2>
            <p className="text-gray-700">
              Pod → Service → Ingress 흐름을 네트워크 맵으로 시뮬레이션
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
