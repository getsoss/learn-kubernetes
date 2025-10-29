"use client";

import Link from "next/link";
import Header from "../../components/Header";

export default function Track2Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track 2. 워크로드 관리
          </h1>
          <p className="text-gray-600 mb-6">
            실제 앱을 배포하고 확장/롤백하는 경험
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">목표</h2>
            <p className="text-gray-700">
              Deployment로 애플리케이션을 배포하고 업데이트할 수 있다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              실습 예시
            </h2>
            <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-gray-200">
              <div>$ kubectl create deployment myapp --image=nginx</div>
              <div>$ kubectl scale deployment myapp --replicas=3</div>
              <div>
                $ kubectl set image deployment/myapp nginx=nginx:1.25 --record
              </div>
              <div>$ kubectl rollout status deployment/myapp</div>
              <div>$ kubectl rollout undo deployment/myapp</div>
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
              보너스 과제
            </h2>
            <p className="text-gray-700">
              YAML을 직접 작성해 배포해보세요. (kubectl apply -f)
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
