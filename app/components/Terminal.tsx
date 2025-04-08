"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { parseKubectlGetNodes } from "../utils/parseKubectlGetNodes";
import { parseKubectlGetPods } from "../utils/parseKubectlGetPods";
import { ResourceVisualizer } from "./ResourceVisualizer";
import { ParsedNode, ParsedPod } from "../types/kubectl";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [parsedNodes, setParsedNodes] = useState<ParsedNode[] | null>(null);
  const [parsedPods, setParsedPods] = useState<ParsedPod[] | null>(null);

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

    requestAnimationFrame(() => {
      if (terminalElement) {
        term.open(terminalElement);
        fitAddon.fit();

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

      setTerminalOutput((prev) => {
        const updated = prev + event.data;

        if (updated.includes("kubectl get nodes")) {
          const parsed = parseKubectlGetNodes(updated);
          setParsedNodes(parsed);
        }

        if (updated.includes("kubectl get pods")) {
          const parsed = parseKubectlGetPods(updated);
          setParsedPods(parsed);
        }

        return updated;
      });
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    terminalInstance.current = term;
  }, []);

  return (
    <div className="flex h-full">
      <div
        ref={terminalRef}
        style={{
          borderRadius: "10px",
          width: "50%",
          height: "95%",
        }}
      />
      <ResourceVisualizer nodes={parsedNodes} pods={parsedPods} />
    </div>
  );
};

export default TerminalComponent;
