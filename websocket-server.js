const WebSocket = require("ws");
const pty = require("node-pty");
const os = require("os");
const url = require("url");

// 플랫폼에 맞는 shell 지정
const shell = os.platform() === "win32" ? "powershell.exe" : "zsh";

const wss = new WebSocket.Server({ port: 8889 });

wss.on("connection", function connection(ws, req) {
  const parsedUrl = url.parse(req.url, true);
  const { target, token } = parsedUrl.query;

  // 프록시 모드: target과 token이 있으면 외부 서버로 프록시
  if (target && token) {
    console.log("🔗 프록시 모드: 외부 서버로 연결");

    const targetUrl = decodeURIComponent(target);
    const accessToken = decodeURIComponent(token);

    // 헤더와 함께 외부 WebSocket 서버에 연결
    const remoteSocket = new WebSocket(targetUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 원격 서버 → 클라이언트
    remoteSocket.on("message", function (data) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    // 클라이언트 → 원격 서버
    ws.on("message", function (message) {
      if (remoteSocket.readyState === WebSocket.OPEN) {
        remoteSocket.send(message);
      }
    });

    remoteSocket.on("open", function () {
      console.log("✅ 원격 WebSocket 연결 성공");
    });

    remoteSocket.on("close", function () {
      console.log("🔌 원격 WebSocket 연결 종료");
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

    remoteSocket.on("error", function (error) {
      console.error("❌ 원격 WebSocket 오류:", error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

    ws.on("close", function () {
      console.log("🔌 클라이언트 연결 종료");
      if (remoteSocket.readyState === WebSocket.OPEN) {
        remoteSocket.close();
      }
    });

    return;
  }

  // 기본 모드: 로컬 터미널 세션
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
