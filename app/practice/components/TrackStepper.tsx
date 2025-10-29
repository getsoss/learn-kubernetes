"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Step = {
  index: number;
  label: string;
};

export default function TrackStepper({
  trackId,
  steps,
  currentStep,
}: {
  trackId: string;
  steps: Step[];
  currentStep: number;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2">
          {steps.map((s) => {
            const href = `/practice/${trackId}/step-${s.index}`;
            const isActive = pathname.endsWith(`/step-${s.index}`);
            return (
              <Link
                key={s.index}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.index}. {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <Link
              href={`/practice/${trackId}/step-${currentStep - 1}`}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              이전
            </Link>
          )}
          {currentStep < steps.length && (
            <Link
              href={`/practice/${trackId}/step-${currentStep + 1}`}
              className="px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              다음
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
