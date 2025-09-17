"use client";

import { useState } from "react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    fontSize: 14,
    autoConnect: true,
    showWelcomeModal: true,
    websocketUrl: "ws://localhost:8889",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">설정</h2>
            <p className="text-gray-600">애플리케이션 설정을 관리하세요</p>
          </div>

          <div className="space-y-6">
            {/* 테마 설정 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">테마</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.theme === "light"}
                    onChange={(e) =>
                      handleSettingChange("theme", e.target.value)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700">라이트 모드</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.theme === "dark"}
                    onChange={(e) =>
                      handleSettingChange("theme", e.target.value)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700">다크 모드</span>
                </label>
              </div>
            </div>

            {/* 터미널 설정 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                터미널
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    폰트 크기: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) =>
                      handleSettingChange("fontSize", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoConnect"
                    checked={settings.autoConnect}
                    onChange={(e) =>
                      handleSettingChange("autoConnect", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="autoConnect" className="text-gray-700">
                    페이지 로드 시 자동으로 웹소켓 연결
                  </label>
                </div>
              </div>
            </div>

            {/* 연결 설정 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">연결</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹소켓 URL
                  </label>
                  <input
                    type="text"
                    value={settings.websocketUrl}
                    onChange={(e) =>
                      handleSettingChange("websocketUrl", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ws://localhost:8889"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showWelcomeModal"
                    checked={settings.showWelcomeModal}
                    onChange={(e) =>
                      handleSettingChange("showWelcomeModal", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="showWelcomeModal" className="text-gray-700">
                    시작 시 환영 모달 표시
                  </label>
                </div>
              </div>
            </div>

            {/* 키보드 단축키 설정 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                키보드 단축키
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">명령어 실행</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono">
                    Enter
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">명령어 중단</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono">
                    Ctrl + C
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">화면 지우기</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono">
                    Ctrl + L
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">히스토리 탐색</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono">
                    ↑ / ↓
                  </kbd>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                기본값으로 복원
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                설정 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
