import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// kubectl 명령어 실행 API
export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    // 보안을 위해 허용된 명령어만 실행
    const allowedCommands = [
      "kubectl get nodes",
      "kubectl get pods",
      "kubectl get services",
      "kubectl get deployments",
      "kubectl describe",
      "kubectl logs",
      "kubectl create",
      "kubectl delete",
      "kubectl apply",
      "kubectl scale",
      "kubectl expose",
    ];

    const isAllowed = allowedCommands.some((allowed) =>
      command.startsWith(allowed)
    );
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Command not allowed" },
        { status: 403 }
      );
    }

    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json({
      output: stdout,
      error: stderr,
    });
  } catch (error) {
    console.error("kubectl 실행 오류:", error);
    return NextResponse.json(
      {
        error: "Command execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
