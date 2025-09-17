import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// kubectl get nodes 명령어 실행 및 파싱
export async function GET() {
  try {
    const { stdout, stderr } = await execAsync("kubectl get nodes -o wide");

    if (stderr) {
      console.error("kubectl stderr:", stderr);
    }

    // kubectl 출력을 파싱하여 노드 정보 추출
    const lines = stdout.trim().split("\n");
    const headerIndex = lines.findIndex(
      (line) => line.includes("NAME") && line.includes("STATUS")
    );

    if (headerIndex === -1) {
      return NextResponse.json({ error: "No header found" }, { status: 500 });
    }

    const nodes = [];
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 6) {
        const node = {
          name: parts[0],
          status: parts[1],
          roles: parts[2],
          age: parts[3],
          version: parts[4],
          internalIP: parts[5] || "",
          externalIP: parts[6] || "",
          osImage: parts[7] || "",
          kernel: parts[8] || "",
          containerRuntime: parts[9] || "",
        };
        nodes.push(node);
      }
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("노드 데이터 가져오기 오류:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch nodes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
