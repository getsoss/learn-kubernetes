const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 7681 });

wss.on("connection", function connection(ws) {
  console.log("클라이언트가 연결되었습니다.");

  ws.on("message", function incoming(message) {
    console.log("받은 메시지: %s", message);
    // 받은 메시지를 그대로 다시 보내줌 (에코 서버)
    ws.send(`서버에서 받은 메시지: ${message}`);
  });

  ws.on("close", () => {
    console.log("클라이언트 연결이 종료되었습니다.");
  });

  ws.send("웹소켓 서버에 연결되었습니다!");
});

console.log("✅ WebSocket 서버가 ws://localhost:7681 에서 실행 중입니다.");
