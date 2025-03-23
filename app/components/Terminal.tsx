import { useEffect } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

const TerminalComponent = () => {
  useEffect(() => {
    const terminalElement = document.getElementById("terminal");

    if (!terminalElement) {
      console.error("터미널 요소를 찾을 수 없습니다.");
      return;
    }

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

    term.open(terminalElement);
    fitAddon.fit();

    const socket = new WebSocket("ws://localhost:8889");

    socket.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket 연결 오류", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket 연결 종료");
    };

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      socket.send(data);
    });

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      term.dispose();
    };
  }, []);

  return <div id="terminal" style={{ height: "400px", width: "100%" }} />;
};

export default TerminalComponent;
