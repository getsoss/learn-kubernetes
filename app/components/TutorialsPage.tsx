"use client";

import { useState } from "react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  commands: string[];
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "basic-nodes",
    title: "노드 확인하기",
    description: "Kubernetes 클러스터의 노드들을 확인하는 방법을 학습합니다.",
    commands: ["kubectl get nodes", "kubectl describe nodes"],
    category: "기본",
  },
  {
    id: "basic-pods",
    title: "Pod 관리하기",
    description: "Pod를 생성, 확인, 삭제하는 방법을 학습합니다.",
    commands: [
      "kubectl get pods",
      "kubectl create pod nginx --image=nginx",
      "kubectl delete pod nginx",
    ],
    category: "기본",
  },
  {
    id: "deployments",
    title: "Deployment 사용하기",
    description: "Deployment를 통해 애플리케이션을 배포하는 방법을 학습합니다.",
    commands: [
      "kubectl create deployment nginx --image=nginx",
      "kubectl get deployments",
      "kubectl scale deployment nginx --replicas=3",
    ],
    category: "중급",
  },
  {
    id: "services",
    title: "Service 생성하기",
    description:
      "Service를 통해 Pod에 네트워크 접근을 제공하는 방법을 학습합니다.",
    commands: [
      "kubectl expose deployment nginx --port=80",
      "kubectl get services",
      "kubectl describe service nginx",
    ],
    category: "중급",
  },
];

const TutorialsPage = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const categories = [
    "전체",
    ...Array.from(new Set(tutorials.map((t) => t.category))),
  ];

  const filteredTutorials =
    selectedCategory === "전체"
      ? tutorials
      : tutorials.filter((t) => t.category === selectedCategory);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Kubernetes 튜토리얼
            </h2>
            <p className="text-gray-600">단계별로 Kubernetes를 학습해보세요</p>
          </div>

          {/* 카테고리 필터 */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTutorial(tutorial)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {tutorial.title}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tutorial.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {tutorial.description}
                </p>
                <div className="text-xs text-gray-500">
                  {tutorial.commands.length}개 명령어
                </div>
              </div>
            ))}
          </div>

          {/* 선택된 튜토리얼 상세보기 */}
          {selectedTutorial && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTutorial.title}
                </h3>
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                {selectedTutorial.description}
              </p>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  실행할 명령어:
                </h4>
                <div className="space-y-2">
                  {selectedTutorial.commands.map((command, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm"
                    >
                      {command}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
