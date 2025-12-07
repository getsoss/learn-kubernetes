"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Html } from "@react-three/drei";
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

// Kubernetes 공식 컬러 팔레트
const K8S_COLORS = {
  primary: "#326CE5", // Kubernetes Blue
  primaryDark: "#1E3A8A",
  primaryLight: "#60A5FA",
  success: "#10B981", // Green
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Red
  info: "#3B82F6", // Blue
  node: "#326CE5",
  pod: "#10B981",
  master: "#3B82F6", // Blue 500 - same as node indicator
  worker: "#326CE5", // Blue for worker nodes
  background: "#0F172A", // Slate 900
  grid: "#1E293B", // Slate 800
  text: "#F1F5F9", // Slate 100
  textSecondary: "#94A3B8", // Slate 400
};

// 상태별 색상 매핑
const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("ready") || statusLower.includes("running")) {
    return K8S_COLORS.success;
  }
  if (statusLower.includes("pending") || statusLower.includes("waiting")) {
    return K8S_COLORS.warning;
  }
  if (
    statusLower.includes("error") ||
    statusLower.includes("failed") ||
    statusLower.includes("crash")
  ) {
    return K8S_COLORS.error;
  }
  return K8S_COLORS.info;
};

// 그리드 플레인 컴포넌트
function GridPlane({
  size = 20,
  divisions = 20,
}: {
  size?: number;
  divisions?: number;
}) {
  const gridHelper = useMemo(() => {
    const helper = new THREE.GridHelper(
      size,
      divisions,
      K8S_COLORS.grid,
      K8S_COLORS.grid
    );
    helper.material.opacity = 0.3;
    helper.material.transparent = true;
    return helper;
  }, [size, divisions]);

  return <primitive object={gridHelper} position={[0, -3, 0]} />;
}

// 고급 노드 메시 컴포넌트
function NodeMesh({
  node,
  position,
  index,
  assignedPods,
}: {
  node: ParsedNode;
  position: [number, number, number];
  index: number;
  assignedPods: ParsedPod[];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);

  const isMaster =
    node.roles?.toLowerCase().includes("master") ||
    node.roles?.toLowerCase().includes("control-plane");
  const nodeColor = isMaster ? K8S_COLORS.master : K8S_COLORS.worker;
  const podCount = assignedPods.length;

  useFrame((state) => {
    if (meshRef.current) {
      // 부드러운 회전 애니메이션
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.1;

      // 호버 시 확대
      const targetScale = hovered ? 1.15 : selected ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // 펄스 효과
    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      );
      const material = pulseRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelected(!selected)}
    >
      {/* 외곽 펄스 링 */}
      <mesh ref={pulseRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 16, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 메인 노드 박스 */}
      <Box args={[1.2, 1.2, 1.2]}>
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </Box>

      {/* 노드 라벨 (노드 위) */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.25}
        color={K8S_COLORS.text}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={K8S_COLORS.background}
      >
        {node.name.length > 15 ? node.name.substring(0, 12) + "..." : node.name}
      </Text>

      {/* 역할 라벨 */}
      {isMaster && (
        <Text
          position={[0, 1.0, 0]}
          fontSize={0.18}
          color={K8S_COLORS.master}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor={K8S_COLORS.background}
        >
          마스터
        </Text>
      )}

      {/* 호버 시 상세 정보 */}
      {hovered && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-slate-700 min-w-[200px]">
            <div className="text-xs font-semibold mb-2 text-blue-400">
              {node.name}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">상태:</span>
                <span className="text-white">{node.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">역할:</span>
                <span className="text-white">{node.roles || "마스터"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">파드:</span>
                <span className="text-green-400">{podCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">생성 시간:</span>
                <span className="text-white">{node.age}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// 고급 파드 메시 컴포넌트
function PodMesh({
  pod,
  position,
  podIndex,
  totalPodsInNode,
}: {
  pod: ParsedPod;
  position: [number, number, number];
  podIndex: number;
  totalPodsInNode: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);

  const statusColor = getStatusColor(pod.status);
  const isRunning = pod.status?.toLowerCase().includes("running");
  const isReady =
    pod.ready?.includes("/") &&
    pod.ready.split("/")[0] === pod.ready.split("/")[1];

  useFrame((state) => {
    if (meshRef.current) {
      // 부드러운 떠다니는 애니메이션
      const floatOffset =
        Math.sin(state.clock.elapsedTime * 1.5 + podIndex) * 0.1;
      meshRef.current.position.y = position[1] + floatOffset;

      // 호버 시 확대
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }

    // 글로우 효과
    if (glowRef.current && isRunning) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity =
        0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  // 파드 위치 계산 (노드 아래 가로선으로 1자 배치)
  const spacing = 1.2; // 파드 간 간격
  const startOffset = -((totalPodsInNode - 1) * spacing) / 2; // 중앙 정렬을 위한 시작 오프셋
  const podX = startOffset + podIndex * spacing;
  const podZ = 0; // Z축은 0으로 고정하여 가로선 유지

  return (
    <group
      ref={meshRef}
      position={[position[0] + podX, position[1], position[2] + podZ]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 글로우 효과 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 메인 파드 구체 */}
      <Sphere args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={hovered ? 1 : isRunning ? 0.7 : 0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </Sphere>

      {/* Ready 상태 인디케이터 */}
      {isReady && (
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={K8S_COLORS.success}
            emissive={K8S_COLORS.success}
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* 파드 라벨 (파드 구체 아래) */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.16}
        color={K8S_COLORS.text}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor={K8S_COLORS.background}
      >
        {pod.name.length > 12 ? pod.name.substring(0, 9) + "..." : pod.name}
      </Text>

      {/* 호버 시 상세 정보 */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm text-white p-2 rounded-lg shadow-xl border border-slate-700 min-w-[180px]">
            <div className="text-xs font-semibold mb-1 text-green-400">
              {pod.name}
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">상태:</span>
                <span className="text-white">{pod.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">준비됨:</span>
                <span
                  className={isReady ? "text-green-400" : "text-yellow-400"}
                >
                  {pod.ready}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">재시작:</span>
                <span className="text-white">{pod.restarts}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// 노드-파드 연결선 컴포넌트 (실제 관계 반영)
function ConnectionLines({
  nodePositions,
  podAssignments,
}: {
  nodePositions: THREE.Vector3[];
  podAssignments: Map<number, ParsedPod[]>;
}) {
  const lines: React.ReactElement[] = [];

  // 각 노드에 할당된 파드들에 대한 연결선 생성
  podAssignments.forEach((assignedPods, nodeIndex) => {
    const nodePos = nodePositions[nodeIndex];

    assignedPods.forEach((pod, podIndex) => {
      // 가로선 배치 계산
      const spacing = 1.2; // 파드 간 간격
      const startOffset = -((assignedPods.length - 1) * spacing) / 2; // 중앙 정렬을 위한 시작 오프셋
      const podX = startOffset + podIndex * spacing;
      const podZ = 0; // Z축은 0으로 고정하여 가로선 유지

      const podPos = new THREE.Vector3(
        nodePos.x + podX,
        nodePos.y - 1.5,
        nodePos.z + podZ
      );

      // 부드러운 곡선 연결선을 위한 중간점
      const midPoint = new THREE.Vector3().lerpVectors(nodePos, podPos, 0.5);
      midPoint.y -= 0.3; // 곡선 효과

      const curve = new THREE.QuadraticBezierCurve3(nodePos, midPoint, podPos);
      const points = curve.getPoints(20);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      lines.push(
        <primitive
          key={`node-${nodeIndex}-pod-${podIndex}`}
          object={
            new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color: K8S_COLORS.primaryLight,
                opacity: 0.7,
                transparent: true,
                linewidth: 3,
              })
            )
          }
        />
      );
    });
  });

  return <>{lines}</>;
}

// 클러스터 레이아웃 계산 함수
function calculateClusterLayout(
  nodes: ParsedNode[],
  pods: ParsedPod[]
): {
  nodePositions: THREE.Vector3[];
  podAssignments: Map<number, ParsedPod[]>;
} {
  const nodePositions: THREE.Vector3[] = [];
  const podAssignments = new Map<number, ParsedPod[]>();

  // 마스터 노드와 워커 노드 분리
  const masterNodes: ParsedNode[] = [];
  const workerNodes: ParsedNode[] = [];

  nodes.forEach((node) => {
    const isMaster =
      node.roles?.toLowerCase().includes("master") ||
      node.roles?.toLowerCase().includes("control-plane");
    if (isMaster) {
      masterNodes.push(node);
    } else {
      workerNodes.push(node);
    }
  });

  // 마스터 노드 배치 (상단 중앙)
  masterNodes.forEach((node, index) => {
    const x = (index - masterNodes.length / 2) * 2.5;
    nodePositions.push(new THREE.Vector3(x, 3, 0));
    podAssignments.set(nodes.indexOf(node), []);
  });

  // 워커 노드 배치 (그리드 형태)
  const cols = Math.ceil(Math.sqrt(workerNodes.length));
  workerNodes.forEach((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = (col - cols / 2) * 3;
    const z = (row - Math.floor(workerNodes.length / cols) / 2) * 3;
    nodePositions.push(new THREE.Vector3(x, 0, z));
    podAssignments.set(nodes.indexOf(node), []);
  });

  // 파드를 노드에 할당 (라운드 로빈 방식)
  pods.forEach((pod, podIndex) => {
    const nodeIndex = podIndex % nodes.length;
    const assigned = podAssignments.get(nodeIndex) || [];
    assigned.push(pod);
    podAssignments.set(nodeIndex, assigned);
  });

  return { nodePositions, podAssignments };
}

export const ResourceVisualizer3D: React.FC<ResourceVisualizer3DProps> = ({
  nodes,
  pods,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 레이아웃 계산
  const layout = useMemo(() => {
    if (!nodes || nodes.length === 0) return null;
    return calculateClusterLayout(nodes, pods || []);
  }, [nodes, pods]);

  // 컴포넌트가 마운트된 후에만 Canvas 렌더링
  useEffect(() => {
    // 전역 에러 핸들러 설정
    const handleError = (event: ErrorEvent) => {
      console.error("3D 렌더링 오류:", event.error);
      setHasError(true);
    };

    // 다음 프레임에서 마운트 상태 설정하여 DOM이 완전히 준비되도록 함
    const timer = requestAnimationFrame(() => {
      // 추가로 약간의 지연을 두어 DOM이 완전히 준비되도록 함
      setTimeout(() => {
        setIsMounted(true);
        setHasError(false);
      }, 0);
    });

    window.addEventListener("error", handleError);

    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("error", handleError);
      setIsMounted(false);
    };
  }, []); // 컴포넌트 마운트 시에만 실행

  if (!nodes && !pods) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium text-slate-100 mb-2">
            Kubernetes 클러스터 뷰
          </h3>
          <p className="text-slate-400 text-sm">
            kubectl 명령어를 실행하면
            <br />
            클러스터를 3D로 시각화합니다
          </p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 폴백 UI
  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-slate-100 mb-2">
            3D 렌더링 오류
          </h3>
          <p className="text-slate-400 text-sm">페이지를 새로고침해주세요</p>
        </div>
      </div>
    );
  }

  // 마운트되지 않았으면 로딩 표시
  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 text-sm">클러스터 뷰 초기화 중...</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return null;
  }

  const { nodePositions, podAssignments } = layout;

  return (
    <div className="h-full w-full relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-300 text-sm">리소스 로딩 중...</p>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 8, 12], fov: 60 }}
          style={{
            background: "transparent",
          }}
          onCreated={() => {
            setHasError(false);
          }}
        >
          {/* 조명 설정 */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, 5, -5]} intensity={0.5} />
          <pointLight
            position={[0, 10, 0]}
            intensity={0.8}
            color={K8S_COLORS.primaryLight}
          />

          {/* 그리드 플레인 */}
          <GridPlane size={30} divisions={30} />

          {/* 연결선 렌더링 */}
          {nodes && pods && pods.length > 0 && (
            <ConnectionLines
              nodePositions={nodePositions}
              podAssignments={podAssignments}
            />
          )}

          {/* 노드 렌더링 */}
          {nodes &&
            nodes.map((node, index) => {
              const assignedPods = podAssignments.get(index) || [];
              const pos = nodePositions[index];
              return (
                <NodeMesh
                  key={`node-${index}`}
                  node={node}
                  position={[pos.x, pos.y, pos.z]}
                  index={index}
                  assignedPods={assignedPods}
                />
              );
            })}

          {/* 파드 렌더링 */}
          {nodes &&
            nodes.map((node, nodeIndex) => {
              const assignedPods = podAssignments.get(nodeIndex) || [];
              const nodePos = nodePositions[nodeIndex];
              return assignedPods.map((pod, podIndex) => (
                <PodMesh
                  key={`pod-${nodeIndex}-${podIndex}`}
                  pod={pod}
                  position={[nodePos.x, nodePos.y - 1.5, nodePos.z]}
                  podIndex={podIndex}
                  totalPodsInNode={assignedPods.length}
                />
              ));
            })}

          {/* 범례 */}
          <group position={[-8, 4, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color={K8S_COLORS.text}
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor={K8S_COLORS.background}
            >
              범례
            </Text>

            {/* 마스터 노드 */}
            <Box args={[0.4, 0.4, 0.4]} position={[0, -0.8, 0]}>
              <meshStandardMaterial
                color={K8S_COLORS.master}
                emissive={K8S_COLORS.master}
                emissiveIntensity={0.5}
              />
            </Box>
            <Text
              position={[0.7, -0.8, 0]}
              fontSize={0.25}
              color={K8S_COLORS.textSecondary}
              anchorX="left"
              anchorY="middle"
            >
              마스터 노드
            </Text>

            {/* 파드 */}
            <Sphere args={[0.2, 8, 8]} position={[0, -2, 0]}>
              <meshStandardMaterial
                color={K8S_COLORS.pod}
                emissive={K8S_COLORS.pod}
                emissiveIntensity={0.7}
              />
            </Sphere>
            <Text
              position={[0.7, -2, 0]}
              fontSize={0.25}
              color={K8S_COLORS.textSecondary}
              anchorX="left"
              anchorY="middle"
            >
              파드
            </Text>
          </group>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={30}
            target={[0, 0, 0]}
            makeDefault
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>

        {/* 통계 오버레이 */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-700">
          <div className="text-xs space-y-2">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">
              클러스터 상태
            </div>
            {nodes && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-200">
                  노드:{" "}
                  <span className="text-blue-400 font-semibold">
                    {nodes.length}
                  </span>
                </span>
              </div>
            )}
            {pods && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-200">
                  파드:{" "}
                  <span className="text-green-400 font-semibold">
                    {pods.length}
                  </span>
                </span>
              </div>
            )}
            {nodes && pods && (
              <div className="pt-2 border-t border-slate-700 mt-2">
                <div className="text-slate-400 text-[10px]">
                  평균 파드/노드:{" "}
                  <span className="text-slate-300">
                    {(pods.length / nodes.length).toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 힌트 */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-slate-700">
          <div className="text-xs text-slate-300 space-y-1.5">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">
              컨트롤
            </div>
            <div className="flex items-center space-x-2">
              <span>🖱️</span>
              <span>드래그: 회전</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔍</span>
              <span>휠: 확대/축소</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⌨️</span>
              <span>Shift+드래그: 이동</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👆</span>
              <span>클릭: 선택</span>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};
