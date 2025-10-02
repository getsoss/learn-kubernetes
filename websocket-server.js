const WebSocket = require("ws");
const pty = require("node-pty");
const os = require("os");

// 플랫폼에 맞는 shell 지정
const shell = process.env.SHELL
  ? process.env.SHELL
  : os.platform() === "win32"
  ? "powershell.exe"
  : "/bin/bash";

const wss = new WebSocket.Server({ port: 8889 });

wss.on("connection", function connection(ws) {
  console.log("✅ 클라이언트가 연결되었습니다.");

  // 터미널 세션 생성
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  // 터미널 출력 → 클라이언트 전송
  ptyProcess.on("data", function (data) {
    ws.send(data);
  });

  // 클라이언트 입력 → 터미널로 전달
  ws.on("message", function incoming(message) {
    ptyProcess.write(message);
  });

  // 연결 종료 시 터미널 세션 종료
  ws.on("close", function () {
    console.log("🔌 클라이언트 연결 종료");
    ptyProcess.kill();
  });

  ptyProcess.on("exit", function () {
    console.log("💀 터미널 세션 종료");
    ws.close();
  });
});

console.log(
  "✅ 터미널 WebSocket 서버가 ws://localhost:8889 에서 실행 중입니다."
);
