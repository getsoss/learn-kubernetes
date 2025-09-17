import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// kubectl get pods 명령어 실행 및 파싱
export async function GET() {
  try {
    const { stdout, stderr } = await execAsync("kubectl get pods -o wide");

    if (stderr) {
      console.error("kubectl stderr:", stderr);
    }

    // kubectl 출력을 파싱하여 파드 정보 추출
    const lines = stdout.trim().split("\n");
    const headerIndex = lines.findIndex(
      (line) =>
        line.includes("NAME") &&
        line.includes("READY") &&
        line.includes("STATUS")
    );

    if (headerIndex === -1) {
      return NextResponse.json({ error: "No header found" }, { status: 500 });
    }

    const pods = [];
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 6) {
        const pod = {
          name: parts[0],
          ready: parts[1],
          status: parts[2],
          restarts: parts[3],
          age: parts[4],
          ip: parts[5] || "",
          node: parts[6] || "",
          nominatedNode: parts[7] || "",
          readinessGates: parts[8] || "",
        };
        pods.push(pod);
      }
    }

    return NextResponse.json(pods);
  } catch (error) {
    console.error("파드 데이터 가져오기 오류:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pods",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
