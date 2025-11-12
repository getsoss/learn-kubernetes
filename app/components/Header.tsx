"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 아이콘 컴포넌트들
const TerminalIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// BookOpenIcon removed (tutorials)

const HelpCircleIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RocketIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4M7 11c4.418 0 8-3.582 8-8 3.314 0 6 2.686 6 6-4.418 0-8 3.582-8 8 0 1.657-.672 3.157-1.757 4.243A6 6 0 015 19c0-1.657.672-3.157 1.757-4.243C7.843 13.672 9.343 13 11 13c4.418 0 8-3.582 8-8"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
  </svg>
);

const getPageInfo = (pathname: string) => {
  if (pathname === "/terminal" || pathname === "/") {
    return {
      title: "터미널",
      description: "Kubernetes 명령어를 직접 실행해보세요",
    };
  } else if (pathname === "/tutorials") {
    return {
      title: "튜토리얼",
      description: "단계별로 Kubernetes를 학습해보세요",
    };
  } else if (pathname === "/help") {
    return {
      title: "도움말",
      description: "사용법과 도움말을 확인하세요",
    };
  }
  return {
    title: "K8s Lab",
    description: "Kubernetes 실습 플랫폼",
  };
};

export default function Header() {
  const pathname = usePathname();
  const pageInfo = getPageInfo(pathname);
  const isTerminal = pathname === "/terminal" || pathname === "/";

  const navItems = [
    { href: "/terminal", label: "터미널", icon: TerminalIcon },
    { href: "/practice", label: "실습하기", icon: RocketIcon },
    { href: "/help", label: "도움말", icon: HelpCircleIcon },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 페이지 제목과 설명 */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">
              {pageInfo.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {pageInfo.description}
            </p>
          </div>

          {/* 오른쪽: 네비게이션 탭과 액션 버튼 */}
          <div className="flex items-center gap-6">
            {/* 네비게이션 탭 */}
            <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === pathname ||
                  (item.href === "/terminal" && pathname === "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 액션 버튼 영역 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
