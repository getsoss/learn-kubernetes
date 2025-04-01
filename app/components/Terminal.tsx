import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null); // 터미널 인스턴스를 관리할 ref 추가

  useEffect(() => {
    if (terminalInstance.current) return; // 이미 터미널 인스턴스가 있으면 초기화하지 않음

    const terminalElement = terminalRef.current;
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // 안전하게 fit 호출
    requestAnimationFrame(() => {
      if (terminalElement) {
        term.open(terminalElement);
        fitAddon.fit();
      } else {
        console.warn("⚠️ 터미널 요소가 아직 준비되지 않았습니다.");
      }
    });

    const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_SOCKET_HOST}:8889`);
    
    socket.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket 연결 종료");
    };

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    terminalInstance.current = term; // 터미널 인스턴스를 ref에 저장
  }, []);

  return <div ref={terminalRef} style={{ height: "400px", width: "100%" }} />;
};

export default TerminalComponent;
