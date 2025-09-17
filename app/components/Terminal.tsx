"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { parseKubectlGetNodes } from "../utils/parseKubectlGetNodes";
import { parseKubectlGetPods } from "../utils/parseKubectlGetPods";
import { ResourceVisualizer } from "./ResourceVisualizer";
import { ParsedNode, ParsedPod } from "../types/kubectl";
import { fetchK8sNodes, fetchK8sPods } from "../utils/k8sApi";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [parsedNodes, setParsedNodes] = useState<ParsedNode[] | null>(null);
  const [parsedPods, setParsedPods] = useState<ParsedPod[] | null>(null);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  // API를 통해 데이터를 가져오는 함수
  const refreshResourceData = async () => {
    try {
      const [nodesData, podsData] = await Promise.all([
        fetchK8sNodes(),
        fetchK8sPods(),
      ]);

      if (nodesData.length > 0) {
        setParsedNodes(nodesData);
      }

      if (podsData.length > 0) {
        setParsedPods(podsData);
      }
    } catch (error) {
      console.error("리소스 데이터 새로고침 실패:", error);
    }
  };

  useEffect(() => {
    if (terminalInstance.current) return;

    const terminalElement = terminalRef.current;
    if (!terminalElement) {
      console.warn("⚠️ 터미널 요소가 아직 준비되지 않았습니다.");
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#282A35",
        foreground: "#ffffff",
      },
      rows: 30,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // 터미널 초기화를 위한 지연
    const initTerminal = () => {
      try {
        term.open(terminalElement);

        // 터미널 스타일링 적용
        setTimeout(() => {
          const viewport = terminalElement.querySelector(".xterm-viewport");
          if (viewport) {
            (viewport as HTMLElement).style.borderRadius = "0px";
            (viewport as HTMLElement).style.overflow = "hidden";
          }

          const rendererOwner = terminalElement.querySelector(
            ".xterm-dom-renderer-owner-1"
          );
          if (rendererOwner) {
            (rendererOwner as HTMLElement).style.padding = "15px";
          }

          // 터미널 크기 조정
          fitAddon.fit();
          setIsTerminalReady(true);
        }, 100);
      } catch (error) {
        console.error("터미널 초기화 오류:", error);
      }
    };

    // DOM이 완전히 로드된 후 초기화
    if (document.readyState === "complete") {
      initTerminal();
    } else {
      window.addEventListener("load", initTerminal);
    }

    const socket = new WebSocket(`ws://localhost:8889`);

    socket.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
      setConnectionStatus("connected");
      // 연결 성공 후 터미널 크기 재조정
      setTimeout(() => fitAddon.fit(), 200);
      // API를 통해 초기 데이터 로드
      refreshResourceData();
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket 연결 종료");
      setConnectionStatus("disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket 오류:", error);
      setConnectionStatus("disconnected");
    };

    socket.onmessage = (event) => {
      try {
        term.write(event.data);

        setTerminalOutput((prev) => {
          const updated = prev + event.data;

          // kubectl get nodes 명령어 파싱 개선
          if (
            updated.includes("kubectl get nodes") &&
            updated.includes("NAME")
          ) {
            const lines = updated.split("\n");
            const nodeStartIndex = lines.findIndex(
              (line) => line.includes("NAME") && line.includes("STATUS")
            );
            if (nodeStartIndex !== -1) {
              const nodeLines = lines
                .slice(nodeStartIndex + 1)
                .filter(
                  (line) =>
                    line.trim() &&
                    !line.includes("kubectl") &&
                    !line.includes("$")
                );
              if (nodeLines.length > 0) {
                const parsed = parseKubectlGetNodes(nodeLines.join("\n"));
                if (parsed && parsed.length > 0) {
                  setParsedNodes(parsed);
                }
              }
            }
            // API를 통해서도 데이터 새로고침
            setTimeout(() => refreshResourceData(), 1000);
          }

          // kubectl get pods 명령어 파싱 개선
          if (
            updated.includes("kubectl get pods") &&
            updated.includes("NAME")
          ) {
            const lines = updated.split("\n");
            const podStartIndex = lines.findIndex(
              (line) => line.includes("NAME") && line.includes("READY")
            );
            if (podStartIndex !== -1) {
              const podLines = lines
                .slice(podStartIndex + 1)
                .filter(
                  (line) =>
                    line.trim() &&
                    !line.includes("kubectl") &&
                    !line.includes("$")
                );
              if (podLines.length > 0) {
                const parsed = parseKubectlGetPods(podLines.join("\n"));
                if (parsed && parsed.length > 0) {
                  setParsedPods(parsed);
                }
              }
            }
            // API를 통해서도 데이터 새로고침
            setTimeout(() => refreshResourceData(), 1000);
          }

          return updated;
        });
      } catch (error) {
        console.error("터미널 메시지 처리 오류:", error);
      }
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    // 터미널 크기 조정 이벤트
    const handleResize = () => {
      setTimeout(() => fitAddon.fit(), 100);
    };

    window.addEventListener("resize", handleResize);

    terminalInstance.current = term;

    // 정리 함수
    return () => {
      window.removeEventListener("load", initTerminal);
      window.removeEventListener("resize", handleResize);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="flex h-full p-6 gap-6 overflow-hidden">
      {/* 터미널 영역 */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="ml-4 text-sm text-gray-600 font-medium">
                터미널
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-400"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {connectionStatus === "connected"
                  ? "연결됨"
                  : connectionStatus === "connecting"
                  ? "연결 중..."
                  : "연결 끊김"}
              </span>
            </div>
          </div>
        </div>
        <div
          ref={terminalRef}
          className="h-full"
          style={{
            height: "calc(100% - 60px)",
          }}
        />
        {!isTerminalReady && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">터미널 초기화 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 리소스 시각화 영역 */}
      <div className="w-96">
        <ResourceVisualizer
          nodes={parsedNodes}
          pods={parsedPods}
          onRefresh={refreshResourceData}
        />
      </div>
    </div>
  );
};

export default TerminalComponent;
