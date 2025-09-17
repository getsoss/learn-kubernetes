// Kubernetes API 클라이언트 유틸리티
export interface K8sNode {
  name: string;
  status: string;
  roles: string;
  age: string;
  version: string;
}

export interface K8sPod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
  namespace: string;
}

export interface K8sApiResponse<T> {
  apiVersion: string;
  items: T[];
  kind: string;
  metadata: {
    resourceVersion: string;
  };
}

// kubectl 명령어를 통해 API 데이터를 가져오는 함수
export async function fetchK8sNodes(): Promise<K8sNode[]> {
  try {
    const response = await fetch("/api/k8s/nodes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("노드 데이터 가져오기 실패:", error);
    return [];
  }
}

export async function fetchK8sPods(): Promise<K8sPod[]> {
  try {
    const response = await fetch("/api/k8s/pods");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("파드 데이터 가져오기 실패:", error);
    return [];
  }
}

// kubectl 명령어 실행을 위한 API 엔드포인트
export async function executeKubectlCommand(command: string): Promise<string> {
  try {
    const response = await fetch("/api/k8s/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.output;
  } catch (error) {
    console.error("kubectl 명령어 실행 실패:", error);
    throw error;
  }
}
