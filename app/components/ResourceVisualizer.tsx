"use client";

import React from "react";
import { ParsedNode } from "../utils/parseKubectlOutput";

interface ResourceVisualizerProps {
  nodes: ParsedNode[] | null;
}

export const ResourceVisualizer: React.FC<ResourceVisualizerProps> = ({
  nodes,
}) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="bg-gray-400 p-4 rounded-xl shadow-xl ml-4 w-1/2 h-[95%] overflow-auto">
      <h2 className="text-lg font-bold mb-4">📦 Kubernetes Nodes</h2>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-500">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Roles</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Version</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-2 border">{node.name}</td>
              <td className="p-2 border">{node.status}</td>
              <td className="p-2 border">{node.roles}</td>
              <td className="p-2 border">{node.age}</td>
              <td className="p-2 border">{node.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
