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
  // terminalOutput은 setTerminalOutput의 콜백에서 prev로 사용됨
  const [, setTerminalOutput] = useState("");
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

    // ==== WebSocket URL 구성 ====
    const WS_IP = process.env.NEXT_PUBLIC_WS_IP;
    const SESSION_ID = process.env.NEXT_PUBLIC_SESSION_ID;

    const ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
      (typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : "");

    // 최종 WebSocket URL
    const WS_URL = `ws://${WS_IP}/session/${SESSION_ID}/${ACCESS_TOKEN}`;

    // 로컬 프록시 서버를 통해 연결 (헤더 지원)
    const PROXY_WS_URL =
      typeof window !== "undefined"
        ? `ws://${
            window.location.hostname
          }:8889/proxy?target=${encodeURIComponent(
            WS_URL ?? ""
          )}&token=${encodeURIComponent(ACCESS_TOKEN ?? "")}`
        : WS_URL ?? "";

    const socket = new WebSocket(PROXY_WS_URL);
    // 텍스트 기반 터미널 통신이므로 binaryType은 기본값(blob) 사용

    socket.onopen = () => {
      console.log("✅ 서버 터미널 연결 성공");
      setConnectionStatus("connected");

      // 연결 성공 후 터미널 크기 재조정
      setTimeout(() => {
        fitAddon.fit();
      }, 200);

      // 서버가 보낸 초기 메시지(프롬프트)를 기다림
      // 연결 성공 메시지는 터미널에 표시하지 않고 콘솔에만 출력
      // 서버가 자동으로 프롬프트를 보내거나, 사용자가 명령어를 입력하면 서버가 응답함

      // API를 통해 초기 데이터 로드
      refreshResourceData();
    };

    socket.onclose = (event) => {
      console.log(
        `🔌 연결 종료 (code: ${event.code}, reason: ${event.reason || "없음"})`
      );
      setConnectionStatus("disconnected");
      if (term) {
        term.writeln(`\r\n❌ 연결 종료 (code: ${event.code})`);
      }
    };

    socket.onerror = (error) => {
      console.error("⚠️ WebSocket 오류:", error);
      setConnectionStatus("disconnected");
      if (term) {
        term.writeln("\r\n⚠️ 연결 오류가 발생했습니다.");
      }
    };

    socket.onmessage = (event) => {
      try {
        // 데이터 타입에 따라 처리
        let data: string;
        if (typeof event.data === "string") {
          data = event.data;
        } else if (event.data instanceof ArrayBuffer) {
          // ArrayBuffer를 문자열로 변환
          const decoder = new TextDecoder();
          data = decoder.decode(event.data);
        } else if (event.data instanceof Blob) {
          // Blob을 텍스트로 읽기 (비동기)
          event.data.text().then((text) => {
            console.log("서버 메시지 (Blob):", text.substring(0, 100)); // 디버깅용
            term.write(text);
            setTerminalOutput((prev) => {
              const updated = prev + text;
              processKubectlOutput(updated);
              return updated;
            });
          });
          return;
        } else {
          data = String(event.data);
        }

        // 디버깅: 서버에서 받은 메시지 로그 (처음 100자만)
        if (data.length > 0) {
          console.log(
            "서버 메시지:",
            data.substring(0, 100).replace(/\n/g, "\\n")
          );
        }

        // 터미널에 데이터 출력 (서버가 보낸 모든 메시지를 그대로 표시)
        term.write(data);

        setTerminalOutput((prev) => {
          const updated = prev + data;
          processKubectlOutput(updated);

          return updated;
        });
      } catch (error) {
        console.error("터미널 메시지 처리 오류:", error);
      }
    };

    // kubectl 출력 파싱 헬퍼 함수
    const processKubectlOutput = (output: string) => {
      // kubectl get nodes 명령어 파싱
      if (output.includes("kubectl get nodes") && output.includes("NAME")) {
        const lines = output.split("\n");
        const nodeStartIndex = lines.findIndex(
          (line) => line.includes("NAME") && line.includes("STATUS")
        );
        if (nodeStartIndex !== -1) {
          const nodeLines = lines
            .slice(nodeStartIndex + 1)
            .filter(
              (line) =>
                line.trim() && !line.includes("kubectl") && !line.includes("$")
            );
          if (nodeLines.length > 0) {
            const parsed = parseKubectlGetNodes(nodeLines.join("\n"));
            if (parsed && parsed.length > 0) {
              setParsedNodes(parsed);
            }
          }
        }
        setTimeout(() => refreshResourceData(), 1000);
      }

      // kubectl get pods 명령어 파싱
      if (output.includes("kubectl get pods") && output.includes("NAME")) {
        const lines = output.split("\n");
        const podStartIndex = lines.findIndex(
          (line) => line.includes("NAME") && line.includes("READY")
        );
        if (podStartIndex !== -1) {
          const podLines = lines
            .slice(podStartIndex + 1)
            .filter(
              (line) =>
                line.trim() && !line.includes("kubectl") && !line.includes("$")
            );
          if (podLines.length > 0) {
            const parsed = parseKubectlGetPods(podLines.join("\n"));
            if (parsed && parsed.length > 0) {
              setParsedPods(parsed);
            }
          }
        }
        setTimeout(() => refreshResourceData(), 1000);
      }
    };

    // 사용자 입력 처리 - Enter 키를 누르면 줄바꿈 포함하여 전송
    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        // Enter 키(CR 또는 LF)가 포함되어 있지 않으면 추가하지 않음
        // xterm.js는 Enter 키를 누르면 자동으로 \r 또는 \n을 포함해서 보내줌
        socket.send(data);
      } else {
        term.writeln("\r\n❌ 연결이 닫혔습니다.");
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
