export interface ParsedPod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
}

export interface ParsedNode {
  name: string;
  status: string;
  roles: string;
  age: string;
  version: string;
  labels?: string;
}
