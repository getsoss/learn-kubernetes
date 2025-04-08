import { ParsedNode } from "../types/kubectl";

function stripAnsi(str: string): string {
  // ANSI escape sequences 제거
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

export function parseKubectlGetNodes(output: string): ParsedNode[] | null {
  // ANSI 코드 제거
  const cleanOutput = stripAnsi(output);

  // 줄 단위로 나누고 양 끝 공백 제거
  const lines = cleanOutput.split("\n").map((line) => line.trim());

  // 헤더 라인 찾기
  const headerIndex = lines.findIndex(
    (line) => line.includes("NAME") && line.includes("STATUS")
  );
  if (headerIndex === -1) return null;

  const dataLines: string[] = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    // 빈 줄이거나 프롬프트가 시작되면 중단
    if (!line || line.startsWith("%") || line.includes("~ %")) break;
    dataLines.push(line);
  }

  return dataLines.map((line) => {
    const [name, status, roles, age, version] = line.trim().split(/\s+/);
    return { name, status, roles, age, version };
  });
}
