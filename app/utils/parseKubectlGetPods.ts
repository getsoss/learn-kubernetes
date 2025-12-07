import { ParsedPod } from "../types/kubectl";

function stripAnsi(str: string): string {
  // ANSI escape sequences 제거
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

export function parseKubectlGetPods(output: string): ParsedPod[] | null {
  try {
    // ANSI 코드 제거
    const cleanOutput = stripAnsi(output);

    const lines = cleanOutput
      .trim()
      .split("\n")
      .map((line) => line.trim());

    // 헤더 라인 찾기 - 파드 테이블은 READY 컬럼이 있고 ROLES가 없어야 함
    const headerIndex = lines.findIndex(
      (line) =>
        line.includes("NAME") &&
        line.includes("READY") &&
        line.includes("STATUS") &&
        !line.includes("ROLES") // 노드 테이블과 구분
    );

    if (headerIndex === -1) {
      console.log(
        "파드 헤더를 찾을 수 없습니다 (READY 컬럼 필요, ROLES 없음):",
        cleanOutput
      );
      return null;
    }

    const dataLines: string[] = [];

    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      // 빈 줄이면 중단 (테이블 끝)
      if (!line) {
        break;
      }

      // 프롬프트나 명령어가 시작되면 중단
      if (
        line.startsWith("%") ||
        line.includes("~ %") ||
        (line.includes("root@") && line.length < 100) || // 프롬프트로 보이는 짧은 줄
        (line.includes("kubectl") && line.length < 100) // 명령어로 보이는 짧은 줄
      ) {
        break;
      }

      // 실제 파드 데이터인지 확인 (최소 3개 컬럼이 있어야 함)
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        dataLines.push(line);
      }
    }

    if (dataLines.length === 0) {
      console.log("파싱할 파드 데이터가 없습니다");
      return null;
    }

    const parsed = dataLines.map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        name: parts[0] || "",
        ready: parts[1] || "",
        status: parts[2] || "",
        restarts: parts[3] || "",
        age: parts[4] || "",
      };
    });

    console.log("파싱된 파드 데이터:", parsed);
    return parsed;
  } catch (error) {
    console.error("파드 파싱 오류:", error);
    return null;
  }
}
