export interface ParsedPod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
}

export function parseKubectlGetPods(output: string): ParsedPod[] | null {
  // ANSI escape codes 제거
  const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");

  const lines = cleanOutput.trim().split("\n");

  const headerIndex = lines.findIndex(
    (line) =>
      line.includes("NAME") && line.includes("READY") && line.includes("STATUS")
  );

  if (headerIndex === -1) return null;

  // 헤더 이후부터 유효한 pod 줄만 파싱
  const dataLines = lines.slice(headerIndex + 1).filter(
    (line) =>
      line.trim() !== "" && /^[a-z0-9.-]+\s+\d+\/\d+\s+\w+/i.test(line.trim()) // 이름 + ready + status가 제대로 있는 줄
  );

  return dataLines.map((line) => {
    const [name, ready, status, restarts, age] = line.trim().split(/\s+/);
    return { name, ready, status, restarts, age };
  });
}
