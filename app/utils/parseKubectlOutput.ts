export interface ParsedNode {
  name: string;
  status: string;
  roles: string;
  age: string;
  version: string;
}

export function parseKubectlGetNodes(output: string): ParsedNode[] | null {
  const lines = output.trim().split("\n");
  const header = lines.find(
    (line) => line.includes("NAME") && line.includes("STATUS")
  );
  if (!header) return null;

  const headerIndex = lines.indexOf(header);
  const dataLines = lines.slice(headerIndex + 1);

  return dataLines.map((line) => {
    const [name, status, roles, age, version] = line.trim().split(/\s+/);
    return { name, status, roles, age, version };
  });
}
