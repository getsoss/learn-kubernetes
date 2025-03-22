import { useEffect } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit"; // xterm addon을 사용하여 크기 조정

const TerminalComponent = () => {
  useEffect(() => {
    const terminalElement = document.getElementById("terminal");

    if (terminalElement) {
      const term = new Terminal();
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalElement);
      fitAddon.fit();

      const socket = new WebSocket("ws://localhost:7681");

      socket.onopen = () => {
        console.log("WebSocket 연결 성공");
      };

      socket.onerror = (error) => {
        console.error("WebSocket 연결 오류", error);
      };

      socket.onclose = () => {
        console.log("WebSocket 연결 종료");
      };

      socket.onmessage = (event) => {
        console.log("서버에서 메시지 수신:", event.data);
      };

      term.onData((data) => {
        socket.send(data);
      });

      window.addEventListener("resize", () => {
        fitAddon.fit();
      });

      return () => {
        window.removeEventListener("resize", () => fitAddon.fit());
      };
    } else {
      console.error("터미널 요소를 찾을 수 없습니다.");
    }
  }, []);

  return <div id="terminal" style={{ height: "400px", width: "100%" }}></div>;
};

export default TerminalComponent;
