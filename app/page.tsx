"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";

// 아이콘 컴포넌트들 (lucide-react 대신 직접 구현)
const TerminalIcon = () => (
  <svg
    className="w-5 h-5"
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

const BookOpenIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const HelpCircleIcon = () => (
  <svg
    className="w-5 h-5"
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

const ChevronRightIcon = () => (
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
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// 터미널 컴포넌트를 동적으로 로드
const TerminalComponent = dynamic(() => import("./components/Terminal"), {
  ssr: false,
});

// 튜토리얼 컴포넌트를 동적으로 로드
const TutorialsPage = dynamic(() => import("./components/TutorialsPage"), {
  ssr: false,
});

// 도움말 컴포넌트를 동적으로 로드
const HelpPage = dynamic(() => import("./components/HelpPage"), {
  ssr: false,
});

// 설정 컴포넌트를 동적으로 로드
const SettingsPage = dynamic(() => import("./components/SettingsPage"), {
  ssr: false,
});

// 사이드바 네비게이션 컴포넌트
const Sidebar = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => {
  const menuItems = [
    { id: "terminal", label: "터미널", icon: TerminalIcon },
    { id: "tutorials", label: "튜토리얼", icon: BookOpenIcon },
    { id: "settings", label: "설정", icon: SettingsIcon },
    { id: "help", label: "도움말", icon: HelpCircleIcon },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">K8s Lab</h1>
        <p className="text-sm text-gray-400 mt-1">Kubernetes 실습 플랫폼</p>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRightIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-gray-300">웹소켓 연결됨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 상단 헤더 컴포넌트
const Header = ({ activeItem }: { activeItem: string }) => {
  const getPageInfo = () => {
    switch (activeItem) {
      case "terminal":
        return {
          title: "터미널",
          description: "Kubernetes 명령어를 직접 실행해보세요",
        };
      case "tutorials":
        return {
          title: "튜토리얼",
          description: "단계별로 Kubernetes를 학습해보세요",
        };
      case "settings":
        return {
          title: "설정",
          description: "애플리케이션 설정을 관리하세요",
        };
      case "help":
        return {
          title: "도움말",
          description: "사용법과 도움말을 확인하세요",
        };
      default:
        return {
          title: "K8s Lab",
          description: "Kubernetes 실습 플랫폼",
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {pageInfo.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{pageInfo.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {activeItem === "terminal" && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <PlayIcon />
              <span className="ml-2">실행</span>
            </button>
          )}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

// 메인 콘텐츠 영역
const MainContent = ({ activeItem }: { activeItem: string }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header activeItem={activeItem} />
      <div className="flex-1 bg-gray-50 overflow-auto">
        {activeItem === "terminal" ? (
          <div className="h-full">
            <TerminalComponent />
          </div>
        ) : activeItem === "tutorials" ? (
          <div className="h-full">
            <TutorialsPage />
          </div>
        ) : activeItem === "help" ? (
          <div className="h-full">
            <HelpPage />
          </div>
        ) : activeItem === "settings" ? (
          <div className="h-full">
            <SettingsPage />
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="p-6">
                <div className="text-center py-20">
                  <TerminalIcon />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    페이지를 찾을 수 없습니다
                  </h3>
                  <p className="text-gray-600">
                    요청하신 페이지가 존재하지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 메인 홈페이지 컴포넌트
export default function HomePage() {
  const [activeItem, setActiveItem] = useState("terminal");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <MainContent activeItem={activeItem} />
    </div>
  );
}
