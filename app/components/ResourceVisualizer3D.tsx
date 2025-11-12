"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei";
import * as THREE from "three";

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

interface ResourceVisualizer3DProps {
  nodes: ParsedNode[] | null;
  pods: ParsedPod[] | null;
}

// Animated Node Component
function NodeMesh({
  node,
  position,
}: {
  node: ParsedNode;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  const color = node.status === "Ready" ? "#10b981" : "#ef4444";

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>
      <Text
        position={[0, -1.4, 0]}
        fontSize={0.2}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        {node.status}
      </Text>
    </group>
  );
}

// Animated Pod Component
function PodMesh({
  pod,
  position,
}: {
  pod: ParsedPod;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  const getColor = () => {
    switch (pod.status) {
      case "Running":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      default:
        return "#ef4444";
    }
  };

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.4, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={getColor()} />
      </Sphere>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {pod.name.split("-")[0]}
      </Text>
      <Text
        position={[0, -1.1, 0]}
        fontSize={0.18}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        {pod.status}
      </Text>
    </group>
  );
}

// Connection Lines Component
function ConnectionLines({
  nodes,
  pods,
}: {
  nodes: ParsedNode[];
  pods: ParsedPod[];
}) {
  const lines = [];

  // Create connections between nodes and pods
  nodes.forEach((node, nodeIndex) => {
    pods.forEach((pod, podIndex) => {
      const nodePos = new THREE.Vector3(
        (nodeIndex - nodes.length / 2) * 3,
        2,
        0
      );
      const podPos = new THREE.Vector3((podIndex - pods.length / 2) * 2, -2, 0);

      const points = [nodePos, podPos];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      lines.push(
        <line key={`${nodeIndex}-${podIndex}`} geometry={geometry}>
          <lineBasicMaterial color="#e5e7eb" opacity={0.3} transparent />
        </line>
      );
    });
  });

  return <>{lines}</>;
}

export const ResourceVisualizer3D: React.FC<ResourceVisualizer3DProps> = ({
  nodes,
  pods,
}) => {
  if (!nodes && !pods) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            3D 리소스 뷰
          </h3>
          <p className="text-gray-600 text-sm">
            kubectl 명령어를 실행하면
            <br />
            3D로 리소스를 시각화합니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        style={{
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Render Nodes */}
        {nodes &&
          nodes.map((node, index) => (
            <NodeMesh
              key={`node-${index}`}
              node={node}
              position={[(index - nodes.length / 2) * 3, 2, 0]}
            />
          ))}

        {/* Render Pods */}
        {pods &&
          pods.map((pod, index) => (
            <PodMesh
              key={`pod-${index}`}
              pod={pod}
              position={[(index - pods.length / 2) * 2, -2, 0]}
            />
          ))}

        {/* Connection Lines */}
        {nodes && pods && <ConnectionLines nodes={nodes} pods={pods} />}

        {/* Legend */}
        <group position={[-6, 3, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.4}
            color="#374151"
            anchorX="left"
            anchorY="middle"
          >
            범례
          </Text>
          <Box args={[0.3, 0.3, 0.3]} position={[0, -0.6, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Box>
          <Text
            position={[0.6, -0.6, 0]}
            fontSize={0.25}
            color="#374151"
            anchorX="left"
            anchorY="middle"
          >
            노드 (정상)
          </Text>
          <Sphere args={[0.15, 8, 8]} position={[0, -1.2, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Sphere>
          <Text
            position={[0.6, -1.2, 0]}
            fontSize={0.25}
            color="#374151"
            anchorX="left"
            anchorY="middle"
          >
            파드 (실행중)
          </Text>
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="text-xs space-y-1">
          {nodes && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>노드: {nodes.length}개</span>
            </div>
          )}
          {pods && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>파드: {pods.length}개</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="text-xs text-gray-600 space-y-1">
          <div>🖱️ 드래그: 회전</div>
          <div>🔍 휠: 확대/축소</div>
          <div>⌨️ Shift+드래그: 이동</div>
        </div>
      </div>
    </div>
  );
};
