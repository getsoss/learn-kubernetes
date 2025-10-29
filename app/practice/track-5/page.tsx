"use client";

import Link from "next/link";
import Header from "../../components/Header";

export default function Track5Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track 5. 고급 운영 실습
          </h1>
          <p className="text-gray-600 mb-6">
            시나리오 중심으로 운영 이슈 다루기
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">목표</h2>
            <p className="text-gray-700">
              장애 원인 파악, 리소스 최적화, Helm 차트 배포 경험.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              실습 예시
            </h2>
            <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-gray-200">
              <div>$ kubectl get pods -A | grep CrashLoopBackOff</div>
              <div>$ kubectl describe pod &lt;pod&gt; -n &lt;ns&gt;</div>
              <div>
                $ kubectl set resources deployment/myapp
                --limits=cpu=500m,memory=256Mi
              </div>
              <div>
                $ helm repo add bitnami https://charts.bitnami.com/bitnami
              </div>
              <div>$ helm install redis bitnami/redis</div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              터미널에서 직접 실행하세요.{" "}
              <Link className="text-blue-600 hover:underline" href="/terminal">
                /terminal
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">보너스</h2>
            <p className="text-gray-700">
              kubectl describe, events로 디버깅하기
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
