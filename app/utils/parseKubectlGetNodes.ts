import { ParsedNode } from "../types/kubectl";

function stripAnsi(str: string): string {
  // ANSI escape sequences 제거
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

export function parseKubectlGetNodes(output: string): ParsedNode[] | null {
  try {
    // ANSI 코드 제거
    const cleanOutput = stripAnsi(output);

    // 줄 단위로 나누고 양 끝 공백 제거
    const lines = cleanOutput.split("\n").map((line) => line.trim());

    // 헤더 라인 찾기 - 노드 테이블은 ROLES 컬럼이 있어야 함
    const headerIndex = lines.findIndex(
      (line) =>
        line.includes("NAME") &&
        line.includes("STATUS") &&
        (line.includes("ROLES") || line.includes("ROLE"))
    );
    if (headerIndex === -1) {
      console.log(
        "노드 헤더를 찾을 수 없습니다 (ROLES 컬럼 필요):",
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

      // 실제 데이터 라인인지 확인 (최소 3개 컬럼이 있어야 함)
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        dataLines.push(line);
      }
    }

    if (dataLines.length === 0) {
      console.log("파싱할 데이터가 없습니다");
      return null;
    }

    const parsed = dataLines.map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        name: parts[0] || "",
        status: parts[1] || "",
        roles: parts[2] || "",
        age: parts[3] || "",
        version: parts[4] || "",
      };
    });

    console.log("파싱된 노드 데이터:", parsed);
    return parsed;
  } catch (error) {
    console.error("노드 파싱 오류:", error);
    return null;
  }
}
