"use client";

import React, { useState } from "react";
import { ResourceVisualizer3D } from "./ResourceVisualizer3D";

interface ParsedNode {
  name: string;
  status: string;
  roles: string;
  age: string;
  version: string;
}

interface ParsedPod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
}

interface ResourceVisualizerProps {
  nodes: ParsedNode[] | null;
  pods: ParsedPod[] | null;
  onRefresh?: () => void;
}

export const ResourceVisualizer: React.FC<ResourceVisualizerProps> = ({
  nodes,
  pods,
  onRefresh,
}) => {
  const [is3DView, setIs3DView] = useState(false);

  // 디버깅: 리소스 상태 확인
  console.log("🔍 ResourceVisualizer 렌더링:", {
    nodes: nodes?.length || 0,
    pods: pods?.length || 0,
    nodesData: nodes,
    podsData: pods,
  });

  if ((!nodes || nodes.length === 0) && (!pods || pods.length === 0)) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">리소스</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIs3DView(!is3DView)}
              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-medium transition-colors"
            >
              {is3DView ? "2D" : "3D"}
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                새로고침
              </button>
            )}
          </div>
        </div>
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              리소스 대기 중
            </h3>
            <p className="text-gray-600 text-sm">
              kubectl 명령어를 실행하면
              <br />
              여기에 결과가 표시됩니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">리소스</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIs3DView(!is3DView)}
            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-medium transition-colors"
          >
            {is3DView ? "2D" : "3D"}
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              새로고침
            </button>
          )}
        </div>
      </div>
      {is3DView ? (
        <div className="flex-1">
          <ResourceVisualizer3D nodes={nodes} pods={pods} />
        </div>
      ) : (
        <div className="p-4 flex-1 overflow-auto space-y-6">
          {/* Nodes Section */}
          {nodes && nodes.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-gray-800">
                  노드 ({nodes.length})
                </h3>
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left font-medium text-gray-700">
                        이름
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        상태
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        역할
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        생성시간
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="p-2 font-mono text-gray-900">
                          {node.name}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              node.status === "Ready"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {node.status}
                          </span>
                        </td>
                        <td className="p-2 text-gray-600">{node.roles}</td>
                        <td className="p-2 text-gray-600">{node.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pods Section */}
          {pods && pods.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-gray-800">
                  파드 ({pods.length})
                </h3>
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left font-medium text-gray-700">
                        이름
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        준비상태
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        상태
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700">
                        재시작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pods.map((pod, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="p-2 font-mono text-gray-900">
                          {pod.name}
                        </td>
                        <td className="p-2 text-gray-600">{pod.ready}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pod.status === "Running"
                                ? "bg-green-100 text-green-800"
                                : pod.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pod.status}
                          </span>
                        </td>
                        <td className="p-2 text-gray-600">{pod.restarts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
