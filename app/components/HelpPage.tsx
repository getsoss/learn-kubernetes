"use client";

const HelpPage = () => {
  const faqs = [
    {
      question: "터미널에서 kubectl 명령어를 어떻게 실행하나요?",
      answer:
        "터미널 페이지에서 직접 kubectl 명령어를 입력하고 Enter를 누르면 실행됩니다. 예: kubectl get nodes, kubectl get pods 등",
    },
    {
      question: "웹소켓 연결이 안 되면 어떻게 하나요?",
      answer:
        "웹소켓 서버가 실행 중인지 확인하세요. 터미널에서 'node websocket-server.js' 명령어로 서버를 시작할 수 있습니다.",
    },
    {
      question: "리소스 시각화가 작동하지 않아요",
      answer:
        "kubectl get nodes 또는 kubectl get pods 명령어를 실행한 후 결과가 표시됩니다. 명령어 실행 후 잠시 기다려주세요.",
    },
    {
      question: "튜토리얼은 어떻게 사용하나요?",
      answer:
        "튜토리얼 페이지에서 원하는 튜토리얼을 선택하고 명령어를 확인한 후, 터미널 페이지에서 직접 실행해보세요.",
    },
  ];

  const shortcuts = [
    { key: "Ctrl + C", description: "현재 실행 중인 명령어 중단" },
    { key: "Ctrl + L", description: "터미널 화면 지우기" },
    { key: "↑ / ↓", description: "명령어 히스토리 탐색" },
    { key: "Tab", description: "명령어 자동완성" },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">도움말</h2>
            <p className="text-gray-600">
              K8s Lab 사용법과 자주 묻는 질문들을 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 자주 묻는 질문 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                자주 묻는 질문
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 키보드 단축키 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                키보드 단축키
              </h3>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <kbd className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded font-mono">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-600 text-sm">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 시작하기 가이드 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              시작하기 가이드
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-blue-900">
                    웹소켓 서버 시작
                  </h4>
                  <p className="text-blue-700 text-sm mt-1">
                    터미널에서{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      node websocket-server.js
                    </code>{" "}
                    명령어로 서버를 시작하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-green-900">
                    터미널에서 명령어 실행
                  </h4>
                  <p className="text-green-700 text-sm mt-1">
                    터미널 페이지에서{" "}
                    <code className="bg-green-100 px-1 rounded">
                      kubectl get nodes
                    </code>{" "}
                    같은 명령어를 실행해보세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-purple-900">리소스 확인</h4>
                  <p className="text-purple-700 text-sm mt-1">
                    오른쪽 패널에서 실행 결과가 시각적으로 표시되는 것을
                    확인하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                추가 도움이 필요하신가요?
              </h3>
              <p className="text-gray-600 text-sm">
                더 많은 도움이 필요하시면 깃허브 이슈를 통해 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
