import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (terminalInstance.current) return;

    const terminalElement = terminalRef.current;
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#282A35",
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

        // xterm viewport에 border-radius와 padding 적용
        const viewport = terminalElement.querySelector(".xterm-viewport");
        if (viewport) {
          (viewport as HTMLElement).style.borderRadius = "15px";
        }

        const rendererOwner = terminalElement.querySelector(
          ".xterm-dom-renderer-owner-1"
        );
        if (rendererOwner) {
          (rendererOwner as HTMLElement).style.padding = "15px";
        }
      } else {
        console.warn("⚠️ 터미널 요소가 아직 준비되지 않았습니다.");
      }
    });

    const socket = new WebSocket(`ws://localhost:8889`);

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

    terminalInstance.current = term;
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        borderRadius: "10px",
        width: "30%",
        height: "95%",
      }}
    />
  );
};

export default TerminalComponent;
