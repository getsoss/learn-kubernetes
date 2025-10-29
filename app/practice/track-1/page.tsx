"use client";

import Link from "next/link";
import Header from "../../components/Header";

export default function Track1Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track 1. 쿠버네티스 기초 입문
          </h1>
          <p className="text-gray-600 mb-6">
            쿠버네티스를 &quot;사용해본다&quot;는 첫 감각을 주는 구간
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">목표</h2>
            <p className="text-gray-700">
              CLI로 Pod를 생성하고 상태를 확인할 수 있다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              실습 예시
            </h2>
            <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-gray-200">
              <div>$ kubectl run nginx --image=nginx</div>
              <div>$ kubectl logs nginx</div>
              <div>$ kubectl delete pod nginx</div>
              <div>$ kubectl run nginx --image=nginx</div>
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
              자동 평가 예시
            </h2>
            <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-gray-200">
              kubectl get pod nginx -o
              jsonpath=&#39;&#123;.status.phase&#125;&#39; → &quot;Running&quot;
              확인
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
