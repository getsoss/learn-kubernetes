"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { parseKubectlGetNodes } from "../utils/parseKubectlGetNodes";
import { parseKubectlGetPods } from "../utils/parseKubectlGetPods";
import { ResourceVisualizer } from "./ResourceVisualizer";
import { ParsedNode, ParsedPod } from "../types/kubectl";
import { problems, Problem } from "../data/problems";
import { groupProblemsByChapter } from "../utils/groupProblemsByChapter";
import {
  saveProblemResult,
  getUserProblemResults,
} from "../lib/problemResults";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const terminalOutputRef = useRef<string>(""); // 터미널 출력을 ref로 저장
  const parseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // terminalOutput은 setTerminalOutput의 콜백에서 prev로 사용됨
  const [, setTerminalOutput] = useState("");
  const [parsedNodes, setParsedNodes] = useState<ParsedNode[] | null>(null);
  const [parsedPods, setParsedPods] = useState<ParsedPod[] | null>(null);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [problemResults, setProblemResults] = useState<
    Record<string, { isCorrect: boolean; message: string } | null>
  >({});
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 문제를 챕터별로 그룹화
  const chapterGroups = groupProblemsByChapter(problems);

  // 유저 ID 가져오기 (URL 파라미터 또는 로컬 스토리지)
  useEffect(() => {
    const getUserId = () => {
      // 1. URL 파라미터에서 uuid 가져오기 (우선순위 1)
      const urlParams = new URLSearchParams(window.location.search);
      const urlUuid = urlParams.get("uuid");
      if (urlUuid) {
        setUserId(urlUuid);
        localStorage.setItem("user_id", urlUuid);
        return urlUuid;
      }

      // 2. URL 파라미터에서 user_id 가져오기 (하위 호환성)
      const urlUserId = urlParams.get("user_id");
      if (urlUserId) {
        setUserId(urlUserId);
        localStorage.setItem("user_id", urlUserId);
        return urlUserId;
      }

      // 3. 로컬 스토리지에서 가져오기
      const storedUserId = localStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
        return storedUserId;
      }

      // 4. 새 UUID 생성
      const newUserId = crypto.randomUUID();
      setUserId(newUserId);
      localStorage.setItem("user_id", newUserId);
      return newUserId;
    };

    const userId = getUserId();
    if (userId) {
      loadProblemResults(userId);
    }
  }, []);

  // DB에서 문제 결과 로드
  const loadProblemResults = async (userId: string) => {
    try {
      const results = await getUserProblemResults(userId);
      setProblemResults(results);
    } catch (error) {
      console.error("문제 결과 로드 실패:", error);
    }
  };

  // 스텝별 완료 상태 계산
  const getStepCompletionStatus = (
    chapterId: string,
    stepProblems: Problem[]
  ): {
    isCompleted: boolean;
    completedCount: number;
    totalCount: number;
  } => {
    const completedProblems = stepProblems.filter(
      (p) => problemResults[p.id]?.isCorrect === true
    );
    return {
      isCompleted:
        stepProblems.length > 0 &&
        completedProblems.length === stepProblems.length,
      completedCount: completedProblems.length,
      totalCount: stepProblems.length,
    };
  };

  // 챕터 접기/펼치기 토글 함수
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // WebSocket을 통해 kubectl 명령어를 실행하여 리소스 데이터를 새로고침하는 함수
  const refreshResourceData = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn(
        "⚠️ WebSocket이 연결되지 않아 리소스를 새로고침할 수 없습니다."
      );
      return;
    }

    console.log("🔄 리소스 데이터 새로고침 중...");
    // kubectl get nodes 실행
    socket.send("kubectl get nodes\n");
    // 잠시 후 kubectl get pods 실행
    setTimeout(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("kubectl get pods\n");
      }
    }, 500);
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

    // URL에서 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    let SESSION_ID = urlParams.get("session_id");
    let ACCESS_TOKEN = urlParams.get("access_token");

    // URL 파라미터가 없으면 localStorage에서 가져오고 URL 업데이트
    if (!SESSION_ID || !ACCESS_TOKEN) {
      const storedSessionId = localStorage.getItem("session_id");
      const storedAccessToken = localStorage.getItem("access_token");

      if (storedSessionId && storedAccessToken) {
        SESSION_ID = storedSessionId;
        ACCESS_TOKEN = storedAccessToken;

        // URL 업데이트 (히스토리 추가하지 않고 교체)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("session_id", storedSessionId);
        newUrl.searchParams.set("access_token", storedAccessToken);
        window.history.replaceState({}, "", newUrl.toString());
      }
    } else {
      // URL에 파라미터가 있으면 localStorage에 저장
      localStorage.setItem("session_id", SESSION_ID);
      localStorage.setItem("access_token", ACCESS_TOKEN);
    }

    const WS_IP = process.env.NEXT_PUBLIC_WS_IP; // WS_IP는 환경변수에서 가져오거나 URL에서도 받을 수 있도록 유지

    let socket: WebSocket;

    // IP와 세션 ID가 없으면 localhost:8889로 직접 연결
    if (!WS_IP || !SESSION_ID) {
      console.log("🔗 IP와 세션 ID가 없어 localhost:8889로 직접 연결합니다.");
      const LOCAL_WS_URL = "ws://localhost:8889";
      socket = new WebSocket(LOCAL_WS_URL);
    } else {
      // IP와 세션 ID가 있으면 기존 로직 사용
      if (!ACCESS_TOKEN) {
        console.error("❌ WS 연결에 필요한 토큰이 없습니다.");
        setConnectionStatus("disconnected");
        return;
      }

      console.log(ACCESS_TOKEN);

      // 최종 WS URL
      const WS_URL = `ws://${WS_IP}/session/${SESSION_ID}?token=${ACCESS_TOKEN}`;

      // 로컬 프록시 서버를 통해 연결
      const PROXY_WS_URL =
        typeof window !== "undefined"
          ? `ws://${
              window.location.hostname
            }:8889/proxy?target=${encodeURIComponent(
              WS_URL
            )}&token=${encodeURIComponent(ACCESS_TOKEN)}`
          : WS_URL;

      socket = new WebSocket(PROXY_WS_URL);
    }

    // socket 참조 저장 (refreshResourceData에서 사용)
    socketRef.current = socket;

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

      // 연결 후 자동으로 kubectl 명령어 실행하여 리소스 가져오기
      // 약간의 지연 후 명령어 실행 (터미널이 준비될 시간 확보)
      setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log("🔄 자동으로 리소스 정보 가져오기...");
          // kubectl get nodes 실행
          socket.send("kubectl get nodes\n");
          // 잠시 후 kubectl get pods 실행
          setTimeout(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send("kubectl get pods\n");
            }
          }, 500);
        }
      }, 1000);
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

            // 터미널 출력을 ref에 누적
            terminalOutputRef.current = terminalOutputRef.current + text;

            // 디바운싱: 출력이 멈춘 후 500ms 후에 파싱 실행
            if (parseTimeoutRef.current) {
              clearTimeout(parseTimeoutRef.current);
            }
            parseTimeoutRef.current = setTimeout(() => {
              console.log("🔄 터미널 출력 파싱 시작 (디바운싱 후, Blob)");
              processKubectlOutput(terminalOutputRef.current);
            }, 500);

            setTerminalOutput((prev) => prev + text);
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

        // 터미널 출력을 ref에 누적
        terminalOutputRef.current = terminalOutputRef.current + data;

        // 디바운싱: 출력이 멈춘 후 500ms 후에 파싱 실행
        if (parseTimeoutRef.current) {
          clearTimeout(parseTimeoutRef.current);
        }
        parseTimeoutRef.current = setTimeout(() => {
          console.log("🔄 터미널 출력 파싱 시작 (디바운싱 후)");
          processKubectlOutput(terminalOutputRef.current);
        }, 500);

        setTerminalOutput((prev) => prev + data);
      } catch (error) {
        console.error("터미널 메시지 처리 오류:", error);
      }
    };

    // ANSI 코드 제거 함수
    const stripAnsi = (str: string): string => {
      return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
    };

    // kubectl 출력 파싱 헬퍼 함수
    const processKubectlOutput = (output: string) => {
      if (!output || output.length === 0) {
        return;
      }

      // ANSI 코드 제거
      const cleanOutput = stripAnsi(output);
      const lines = cleanOutput.split("\n").map((line) => line.trim());
      const totalLines = lines.length;

      console.log(
        `🔍 전체 출력 라인 수: ${totalLines}, 최근 10줄:`,
        lines.slice(-10)
      );

      // 최근 출력 부분만 확인 (마지막 300줄)
      const startIndex = Math.max(0, totalLines - 300);
      const recentLines = lines.slice(startIndex);

      // 노드 테이블 찾기: ROLES 컬럼이 있는 테이블
      let nodeHeaderIndex = -1;
      for (let i = recentLines.length - 1; i >= 0; i--) {
        const line = recentLines[i];
        if (
          line.includes("NAME") &&
          line.includes("STATUS") &&
          (line.includes("ROLES") || line.includes("ROLE"))
        ) {
          nodeHeaderIndex = i;
          break;
        }
      }

      if (nodeHeaderIndex !== -1) {
        console.log("✅ 노드 테이블 헤더 발견:", recentLines[nodeHeaderIndex]);
        const absoluteNodeHeaderIndex = startIndex + nodeHeaderIndex;
        const nodeDataLines: string[] = [];

        // 노드 테이블 데이터 추출
        for (let i = absoluteNodeHeaderIndex + 1; i < totalLines; i++) {
          const line = lines[i];
          if (!line) {
            // 빈 줄이면 중단
            break;
          }

          // 다음 테이블 헤더나 프롬프트 확인
          if (
            (line.includes("NAME") &&
              line.includes("READY") &&
              !line.includes("ROLES")) ||
            line.includes("root@") ||
            (line.includes("kubectl") && line.length < 100)
          ) {
            break;
          }

          // 데이터 라인 확인 (최소 3개 컬럼)
          const parts = line.split(/\s+/).filter((p) => p.length > 0);
          if (parts.length >= 3) {
            nodeDataLines.push(line);
          }
        }

        console.log(`📊 노드 데이터 라인 수: ${nodeDataLines.length}`);
        if (nodeDataLines.length > 0) {
          // 헤더와 데이터를 함께 전달
          const headerLine = recentLines[nodeHeaderIndex];
          const dataToParse = headerLine + "\n" + nodeDataLines.join("\n");
          console.log("📝 노드 파싱할 데이터:", dataToParse.substring(0, 200));
          const parsed = parseKubectlGetNodes(dataToParse);
          if (parsed && parsed.length > 0) {
            console.log("✅ 노드 데이터 파싱 성공:", parsed);
            setParsedNodes(parsed);
          } else {
            console.warn("⚠️ 노드 파싱 실패");
          }
        }
      }

      // 파드 테이블 찾기: READY 컬럼이 있고 ROLES가 없는 테이블
      let podHeaderIndex = -1;
      for (let i = recentLines.length - 1; i >= 0; i--) {
        const line = recentLines[i];
        if (
          line.includes("NAME") &&
          line.includes("READY") &&
          line.includes("STATUS") &&
          !line.includes("ROLES")
        ) {
          podHeaderIndex = i;
          break;
        }
      }

      if (podHeaderIndex !== -1) {
        console.log("✅ 파드 테이블 헤더 발견:", recentLines[podHeaderIndex]);
        const absolutePodHeaderIndex = startIndex + podHeaderIndex;
        const podDataLines: string[] = [];

        // 파드 테이블 데이터 추출
        for (let i = absolutePodHeaderIndex + 1; i < totalLines; i++) {
          const line = lines[i];
          if (!line) {
            // 빈 줄이면 중단
            break;
          }

          // 다음 테이블 헤더나 프롬프트 확인
          if (
            (line.includes("NAME") && line.includes("ROLES")) ||
            line.includes("root@") ||
            (line.includes("kubectl") && line.length < 100)
          ) {
            break;
          }

          // 데이터 라인 확인 (최소 3개 컬럼)
          const parts = line.split(/\s+/).filter((p) => p.length > 0);
          if (parts.length >= 3) {
            podDataLines.push(line);
          }
        }

        console.log(`📊 파드 데이터 라인 수: ${podDataLines.length}`);
        if (podDataLines.length > 0) {
          // 헤더와 데이터를 함께 전달
          const headerLine = recentLines[podHeaderIndex];
          const dataToParse = headerLine + "\n" + podDataLines.join("\n");
          console.log("📝 파드 파싱할 데이터:", dataToParse.substring(0, 200));
          const parsed = parseKubectlGetPods(dataToParse);
          if (parsed && parsed.length > 0) {
            console.log("✅ 파드 데이터 파싱 성공:", parsed);
            setParsedPods(parsed);
          } else {
            console.warn("⚠️ 파드 파싱 실패");
          }
        }
      } else {
        console.log("🔍 파드 테이블 헤더를 찾지 못함");
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
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current);
      }
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      socketRef.current = null;
    };
  }, []);

  const handleCheckAnswer = async (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    const result = problem.checkAnswer(parsedNodes, parsedPods);

    // 로컬 상태 업데이트
    setProblemResults((prev) => ({
      ...prev,
      [problemId]: result,
    }));

    // DB에 저장 (유저 ID가 있는 경우)
    if (userId) {
      try {
        await saveProblemResult(
          userId,
          problemId,
          result.isCorrect,
          result.message
        );
      } catch (error) {
        console.error("문제 결과 저장 실패:", error);
        // 저장 실패해도 UI는 업데이트됨
      }
    }
  };

  return (
    <div className="flex h-full p-6 gap-6 overflow-hidden relative">
      {/* 문제 목록 영역 (왼쪽) */}
      {isProblemPanelOpen && (
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">문제 목록</h2>
            <button
              onClick={() => setIsProblemPanelOpen(false)}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="문제 목록 닫기"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {chapterGroups.map((chapter) => {
                const isExpanded = expandedChapters.has(chapter.chapterId);
                const stepStatus = getStepCompletionStatus(
                  chapter.chapterId,
                  chapter.problems
                );
                const isStepCompleted = stepStatus.isCompleted;

                return (
                  <div
                    key={chapter.chapterId}
                    className={`border rounded-lg overflow-hidden transition-colors ${
                      isStepCompleted
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* 챕터 헤더 (클릭 가능) */}
                    <button
                      onClick={() => toggleChapter(chapter.chapterId)}
                      className={`w-full px-4 py-3 transition-colors flex items-center justify-between text-left ${
                        isStepCompleted
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              isStepCompleted
                                ? "text-green-900"
                                : "text-gray-900"
                            }`}
                          >
                            {chapter.chapterName}
                          </h3>
                          {isStepCompleted && (
                            <span
                              className="text-green-600 font-bold"
                              title="스텝 완료"
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isStepCompleted ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {chapter.problems.length}개 문제
                          <span className="ml-1">
                            ({stepStatus.completedCount}/{stepStatus.totalCount}{" "}
                            완료)
                          </span>
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          isExpanded ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* 챕터 내용 (접기/펼치기) */}
                    {isExpanded && (
                      <div className="p-3 space-y-3 border-t border-gray-200">
                        {chapter.problems.map((problem) => {
                          const result = problemResults[problem.id];
                          return (
                            <div
                              key={problem.id}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                              <p className="text-sm text-gray-700 mb-2">
                                {problem.text}
                              </p>
                              <button
                                onClick={() => handleCheckAnswer(problem.id)}
                                className="w-full px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                              >
                                정답 확인
                              </button>
                              {result && (
                                <div
                                  className={`mt-2 p-2 rounded text-xs ${
                                    result.isCorrect
                                      ? "bg-green-50 text-green-800 border border-green-200"
                                      : "bg-red-50 text-red-800 border border-red-200"
                                  }`}
                                >
                                  <div className="font-semibold mb-1">
                                    {result.isCorrect ? "✓ 정답" : "✗ 오답"}
                                  </div>
                                  <div>{result.message}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 문제 목록 열기 버튼 (접혔을 때만 표시) */}
      {!isProblemPanelOpen && (
        <button
          onClick={() => setIsProblemPanelOpen(true)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white rounded-r-lg shadow-md border border-gray-200 border-l-0 px-3 py-4 hover:bg-gray-50 transition-colors"
          title="문제 목록 열기"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
        </button>
      )}

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
