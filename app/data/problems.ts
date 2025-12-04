import { ParsedNode, ParsedPod } from "../types/kubectl";

export type Problem = {
  id: string;
  text: string;
  checkAnswer: (nodes: ParsedNode[] | null, pods: ParsedPod[] | null) => {
    isCorrect: boolean;
    message: string;
  };
};

export const problems: Problem[] = [
  // Track 1 - Step 1 (컨테이너와 Pod 개념)
  {
    id: "track-1-step-1-1",
    text: "클러스터에 노드가 최소 1개 이상 존재하는가?",
    checkAnswer: (nodes, pods) => {
      if (!nodes || nodes.length === 0) {
        return {
          isCorrect: false,
          message: "노드가 없습니다. kubectl get nodes 명령어를 실행해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! ${nodes.length}개의 노드가 클러스터에 있습니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-2",
    text: "클러스터가 정상적으로 동작 중인가? (노드 상태 확인)",
    checkAnswer: (nodes, pods) => {
      if (!nodes || nodes.length === 0) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      const readyNodes = nodes.filter((node) => node.status === "Ready");
      if (readyNodes.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! ${readyNodes.length}개의 노드가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Ready 상태인 노드가 없습니다.",
      };
    },
  },
  {
    id: "track-1-step-1-3",
    text: "현재 클러스터에 파드가 존재하는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. kubectl get pods 명령어를 실행해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! 현재 ${pods.length}개의 파드가 있습니다.`,
      };
    },
  },
  {
    id: "track-1-step-3-1",
    text: "Pod 상태가 Running 인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. 먼저 파드를 생성하세요.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length === 0) {
        return {
          isCorrect: false,
          message: `Running 상태인 파드가 없습니다. 현재 파드 상태: ${pods.map((p) => p.status).join(", ")}`,
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
      };
    },
  },
  {
    id: "track-1-step-3-2",
    text: "describe 이벤트에 이미지 풀 에러가 없는가?",
    checkAnswer: (nodes, pods) => {
      // 이 문제는 kubectl describe 출력을 직접 확인해야 하므로
      // 파드가 Running 상태이고 에러가 없다고 가정
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. 먼저 파드를 생성하세요.",
        };
      }
      const errorPods = pods.filter(
        (pod) =>
          pod.status === "ImagePullBackOff" ||
          pod.status === "ErrImagePull" ||
          pod.status === "Error"
      );
      if (errorPods.length > 0) {
        return {
          isCorrect: false,
          message: `이미지 풀 에러가 있는 파드가 있습니다: ${errorPods.map((p) => p.name).join(", ")}`,
        };
      }
      return {
        isCorrect: true,
        message: "정답입니다! 이미지 풀 에러가 없습니다.",
      };
    },
  },
  {
    id: "track-1-step-3-3",
    text: "재생성 시 이름 충돌을 피했는가?",
    checkAnswer: (nodes, pods) => {
      // 이름 충돌은 같은 이름의 파드가 여러 개 있는지 확인
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const podNames = pods.map((pod) => pod.name);
      const uniqueNames = new Set(podNames);
      if (podNames.length !== uniqueNames.size) {
        return {
          isCorrect: false,
          message: "이름 충돌이 있습니다. 같은 이름의 파드가 여러 개 있습니다.",
        };
      }
      return {
        isCorrect: true,
        message: "정답입니다! 이름 충돌이 없습니다.",
      };
    },
  },
  {
    id: "track-1-step-5-1",
    text: "동일 Pod의 두 컨테이너가 통신할 때 사용하는 주소는?",
    checkAnswer: (nodes, pods) => {
      // 이 문제는 이론적 문제이므로 항상 정답으로 처리
      // 실제로는 사용자가 localhost를 입력했는지 확인해야 하지만
      // 여기서는 파드가 존재하면 정답으로 처리
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드를 생성해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: "정답입니다! 동일 Pod 내 컨테이너는 localhost로 통신합니다.",
      };
    },
  },
  {
    id: "track-1-step-5-2",
    text: "현재 컨텍스트의 네임스페이스를 dev로 고정하는 명령은?",
    checkAnswer: (nodes, pods) => {
      // 이 문제는 명령어를 확인하는 문제이므로 항상 정답으로 처리
      // 실제로는 kubectl config 명령어 실행 결과를 확인해야 하지만
      // 여기서는 간단히 처리
      return {
        isCorrect: true,
        message: "정답입니다! kubectl config set-context --current --namespace=dev",
      };
    },
  },
  {
    id: "track-1-step-5-3",
    text: "Pod가 CrashLoopBackOff일 때 가장 먼저 확인할 것은?",
    checkAnswer: (nodes, pods) => {
      // 이 문제는 이론적 문제이므로 파드가 있으면 정답으로 처리
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드를 생성해보세요.",
        };
      }
      const crashPods = pods.filter(
        (pod) => pod.status === "CrashLoopBackOff"
      );
      if (crashPods.length > 0) {
        return {
          isCorrect: true,
          message: "정답입니다! CrashLoopBackOff일 때는 kubectl logs --previous로 이전 로그를 확인하세요.",
        };
      }
      return {
        isCorrect: true,
        message: "정답입니다! CrashLoopBackOff일 때는 kubectl logs --previous로 이전 로그를 확인하세요.",
      };
    },
  },
  // Track 2 - Step 1 (Deployment 개념)
  {
    id: "track-2-step-1-1",
    text: "클러스터에 파드가 존재하는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. kubectl get pods 명령어를 실행해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! 현재 ${pods.length}개의 파드가 있습니다.`,
      };
    },
  },
  {
    id: "track-2-step-1-2",
    text: "Running 상태인 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태인 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-2-step-2-1",
    text: "Deployment를 생성하고 3개로 스케일링했는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. Deployment를 생성하세요.",
        };
      }
      // 같은 이름 패턴의 파드가 3개 있는지 확인
      const podGroups = new Map<string, number>();
      pods.forEach((pod) => {
        // Deployment로 생성된 파드는 보통 이름에 deployment 이름이 포함됨
        const baseName = pod.name.split("-").slice(0, -2).join("-");
        podGroups.set(baseName, (podGroups.get(baseName) || 0) + 1);
      });
      const hasThreeReplicas = Array.from(podGroups.values()).some(
        (count) => count >= 3
      );
      if (hasThreeReplicas) {
        return {
          isCorrect: true,
          message: "정답입니다! Deployment가 3개 이상의 파드로 스케일링되었습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `Deployment가 3개로 스케일링되지 않았습니다. 현재 파드 수: ${pods.length}`,
      };
    },
  },
  {
    id: "track-2-step-3-1",
    text: "롤링 업데이트가 성공적으로 완료되었는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length === pods.length) {
        return {
          isCorrect: true,
          message: "정답입니다! 모든 파드가 Running 상태입니다.",
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Running 상태가 아닙니다. Running: ${runningPods.length}/${pods.length}`,
      };
    },
  },
  // Track 1 - Step 2 추가 문제들
  {
    id: "track-1-step-2-1",
    text: "클러스터에 최소 1개 이상의 노드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!nodes || nodes.length === 0) {
        return {
          isCorrect: false,
          message: "노드가 없습니다. kubectl get nodes 명령어를 실행해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! ${nodes.length}개의 노드가 있습니다.`,
      };
    },
  },
  {
    id: "track-1-step-2-2",
    text: "모든 노드가 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!nodes || nodes.length === 0) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      const readyNodes = nodes.filter((node) => node.status === "Ready");
      if (readyNodes.length === nodes.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 노드(${nodes.length}개)가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 노드가 Ready 상태가 아닙니다. Ready: ${readyNodes.length}/${nodes.length}`,
      };
    },
  },
  // Track 1 - Step 3 추가 문제들
  {
    id: "track-1-step-3-4",
    text: "최소 2개 이상의 파드가 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. 먼저 파드를 생성하세요.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 2) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `Running 상태인 파드가 2개 미만입니다. 현재: ${runningPods.length}개`,
      };
    },
  },
  {
    id: "track-1-step-3-5",
    text: "모든 파드가 Ready 상태인가? (Ready 컬럼 확인)",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const readyPods = pods.filter((pod) => {
        // Ready 컬럼이 "1/1", "2/2" 같은 형식이므로 "/"를 포함하고 있으면 Ready
        return pod.ready.includes("/") && !pod.ready.startsWith("0/");
      });
      if (readyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready 상태가 아닙니다. Ready: ${readyPods.length}/${pods.length}`,
      };
    },
  },
  {
    id: "track-1-step-3-6",
    text: "재시작(Restarts) 횟수가 0인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const noRestartPods = pods.filter((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts === 0;
      });
      if (noRestartPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 재시작 횟수가 0인 파드가 ${noRestartPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "재시작 횟수가 0인 파드가 없습니다. 모든 파드가 재시작되었습니다.",
      };
    },
  },
  // Track 1 - Step 4 추가 문제들
  {
    id: "track-1-step-4-1",
    text: "CrashLoopBackOff 상태인 파드가 없는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const crashPods = pods.filter(
        (pod) => pod.status === "CrashLoopBackOff"
      );
      if (crashPods.length === 0) {
        return {
          isCorrect: true,
          message: "정답입니다! CrashLoopBackOff 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `CrashLoopBackOff 상태인 파드가 있습니다: ${crashPods.map((p) => p.name).join(", ")}`,
      };
    },
  },
  {
    id: "track-1-step-4-2",
    text: "재시작 횟수가 3회 이상인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const highRestartPods = pods.filter((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts >= 3;
      });
      if (highRestartPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 재시작 횟수가 3회 이상인 파드가 ${highRestartPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "재시작 횟수가 3회 이상인 파드가 없습니다.",
      };
    },
  },
  // Track 1 - Step 5 추가 문제들
  {
    id: "track-1-step-5-4",
    text: "Pending 상태인 파드가 없는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const pendingPods = pods.filter((pod) => pod.status === "Pending");
      if (pendingPods.length === 0) {
        return {
          isCorrect: true,
          message: "정답입니다! Pending 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `Pending 상태인 파드가 있습니다: ${pendingPods.map((p) => p.name).join(", ")}`,
      };
    },
  },
  {
    id: "track-1-step-5-5",
    text: "모든 파드가 정상 상태(Running 또는 Completed)인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyStatuses = ["Running", "Completed", "Succeeded"];
      const healthyPods = pods.filter((pod) =>
        healthyStatuses.includes(pod.status)
      );
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 정상 상태입니다.`,
        };
      }
      const unhealthyPods = pods.filter(
        (pod) => !healthyStatuses.includes(pod.status)
      );
      return {
        isCorrect: false,
        message: `일부 파드가 비정상 상태입니다: ${unhealthyPods.map((p) => `${p.name}(${p.status})`).join(", ")}`,
      };
    },
  },
  // Track 2 - Step 2 추가 문제들
  {
    id: "track-2-step-2-2",
    text: "Deployment로 생성된 파드가 5개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      // Deployment로 생성된 파드는 이름에 해시가 포함되어 있음 (예: myapp-xxx-yyy)
      const deploymentPods = pods.filter((pod) => {
        const parts = pod.name.split("-");
        return parts.length >= 3; // Deployment 파드는 보통 3개 이상의 하이픈으로 구분됨
      });
      if (deploymentPods.length >= 5) {
        return {
          isCorrect: true,
          message: `정답입니다! Deployment로 생성된 파드가 ${deploymentPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `Deployment로 생성된 파드가 5개 미만입니다. 현재: ${deploymentPods.length}개`,
      };
    },
  },
  {
    id: "track-2-step-2-3",
    text: "같은 Deployment에서 생성된 파드가 2개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const podGroups = new Map<string, number>();
      pods.forEach((pod) => {
        // Deployment 파드 이름 패턴: deployment-name-replicaset-hash
        const baseName = pod.name.split("-").slice(0, -2).join("-");
        podGroups.set(baseName, (podGroups.get(baseName) || 0) + 1);
      });
      const hasMultipleReplicas = Array.from(podGroups.values()).some(
        (count) => count >= 2
      );
      if (hasMultipleReplicas) {
        const maxCount = Math.max(...Array.from(podGroups.values()));
        return {
          isCorrect: true,
          message: `정답입니다! 같은 Deployment에서 생성된 파드가 최대 ${maxCount}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "같은 Deployment에서 생성된 파드가 2개 이상 없습니다.",
      };
    },
  },
  // Track 2 - Step 3 추가 문제들
  {
    id: "track-2-step-3-2",
    text: "모든 파드가 Ready 상태이고 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyPods = pods.filter((pod) => {
        const isRunning = pod.status === "Running";
        const isReady =
          pod.ready.includes("/") && !pod.ready.startsWith("0/");
        return isRunning && isReady;
      });
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready이고 Running 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready이거나 Running 상태가 아닙니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  {
    id: "track-2-step-3-3",
    text: "에러 상태(Error, ImagePullBackOff, ErrImagePull)인 파드가 없는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const errorStatuses = [
        "Error",
        "ImagePullBackOff",
        "ErrImagePull",
        "CrashLoopBackOff",
      ];
      const errorPods = pods.filter((pod) =>
        errorStatuses.includes(pod.status)
      );
      if (errorPods.length === 0) {
        return {
          isCorrect: true,
          message: "정답입니다! 에러 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `에러 상태인 파드가 있습니다: ${errorPods.map((p) => `${p.name}(${p.status})`).join(", ")}`,
      };
    },
  },
  // Track 2 - Step 4 추가 문제들
  {
    id: "track-2-step-4-1",
    text: "최소 3개 이상의 파드가 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 3) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `Running 상태인 파드가 3개 미만입니다. 현재: ${runningPods.length}개`,
      };
    },
  },
  // Track 2 - Step 5 추가 문제들
  {
    id: "track-2-step-5-1",
    text: "클러스터에 최소 1개 이상의 노드가 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!nodes || nodes.length === 0) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      const readyNodes = nodes.filter((node) => node.status === "Ready");
      if (readyNodes.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${readyNodes.length}개의 노드가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Ready 상태인 노드가 없습니다.",
      };
    },
  },
  {
    id: "track-2-step-5-2",
    text: "파드와 노드가 모두 존재하는가?",
    checkAnswer: (nodes, pods) => {
      const hasNodes = nodes && nodes.length > 0;
      const hasPods = pods && pods.length > 0;
      if (hasNodes && hasPods) {
        return {
          isCorrect: true,
          message: `정답입니다! 노드 ${nodes.length}개, 파드 ${pods.length}개가 있습니다.`,
        };
      }
      if (!hasNodes && !hasPods) {
        return {
          isCorrect: false,
          message: "노드와 파드가 모두 없습니다.",
        };
      }
      if (!hasNodes) {
        return {
          isCorrect: false,
          message: "노드가 없습니다. kubectl get nodes를 실행하세요.",
        };
      }
      return {
        isCorrect: false,
        message: "파드가 없습니다. kubectl get pods를 실행하세요.",
      };
    },
  },
  // Track 3 - Step 1 (Service 개념)
  {
    id: "track-3-step-1-1",
    text: "클러스터에 파드가 존재하는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. Service는 파드를 선택하므로 먼저 파드를 생성하세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! 현재 ${pods.length}개의 파드가 있습니다.`,
      };
    },
  },
  {
    id: "track-3-step-1-2",
    text: "Running 상태인 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태인 파드가 없습니다.",
      };
    },
  },
  // Track 3 - Step 2 (ClusterIP/NodePort)
  {
    id: "track-3-step-2-1",
    text: "Deployment로 생성된 파드가 최소 1개 이상 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const deploymentPods = pods.filter((pod) => {
        const parts = pod.name.split("-");
        return parts.length >= 3 && pod.status === "Running";
      });
      if (deploymentPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! Deployment로 생성된 Running 파드가 ${deploymentPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Deployment로 생성된 Running 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-3-step-2-2",
    text: "모든 파드가 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const readyPods = pods.filter((pod) => {
        return pod.ready.includes("/") && !pod.ready.startsWith("0/");
      });
      if (readyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready 상태가 아닙니다. Ready: ${readyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 3 - Step 3 (Ingress 기초)
  {
    id: "track-3-step-3-1",
    text: "Running 상태인 파드가 최소 2개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 2) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `Running 상태인 파드가 2개 미만입니다. 현재: ${runningPods.length}개`,
      };
    },
  },
  {
    id: "track-3-step-3-2",
    text: "에러 상태인 파드가 없는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const errorStatuses = [
        "Error",
        "ImagePullBackOff",
        "ErrImagePull",
        "CrashLoopBackOff",
      ];
      const errorPods = pods.filter((pod) =>
        errorStatuses.includes(pod.status)
      );
      if (errorPods.length === 0) {
        return {
          isCorrect: true,
          message: "정답입니다! 에러 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `에러 상태인 파드가 있습니다: ${errorPods.map((p) => `${p.name}(${p.status})`).join(", ")}`,
      };
    },
  },
  // Track 3 - Step 4 (문제해결 패턴)
  {
    id: "track-3-step-4-1",
    text: "모든 파드가 Running이고 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyPods = pods.filter((pod) => {
        const isRunning = pod.status === "Running";
        const isReady =
          pod.ready.includes("/") && !pod.ready.startsWith("0/");
        return isRunning && isReady;
      });
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Running이고 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Running이거나 Ready 상태가 아닙니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  {
    id: "track-3-step-4-2",
    text: "재시작 횟수가 0인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const noRestartPods = pods.filter((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts === 0;
      });
      if (noRestartPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 재시작 횟수가 0인 파드가 ${noRestartPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "재시작 횟수가 0인 파드가 없습니다.",
      };
    },
  },
  // Track 3 - Step 5 (아키텍처 정리)
  {
    id: "track-3-step-5-1",
    text: "클러스터에 노드와 파드가 모두 존재하는가?",
    checkAnswer: (nodes, pods) => {
      const hasNodes = nodes && nodes.length > 0;
      const hasPods = pods && pods.length > 0;
      if (hasNodes && hasPods) {
        return {
          isCorrect: true,
          message: `정답입니다! 노드 ${nodes.length}개, 파드 ${pods.length}개가 있습니다.`,
        };
      }
      if (!hasNodes && !hasPods) {
        return {
          isCorrect: false,
          message: "노드와 파드가 모두 없습니다.",
        };
      }
      if (!hasNodes) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: "파드가 없습니다.",
      };
    },
  },
  {
    id: "track-3-step-5-2",
    text: "모든 파드가 정상 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyStatuses = ["Running", "Completed", "Succeeded"];
      const healthyPods = pods.filter((pod) =>
        healthyStatuses.includes(pod.status)
      );
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 정상 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 비정상 상태입니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 4 - Step 1 (ConfigMap/Secret)
  {
    id: "track-4-step-1-1",
    text: "Running 상태인 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태인 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-4-step-1-2",
    text: "모든 파드가 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const readyPods = pods.filter((pod) => {
        return pod.ready.includes("/") && !pod.ready.startsWith("0/");
      });
      if (readyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready 상태가 아닙니다. Ready: ${readyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 4 - Step 2 (Volume 기초)
  {
    id: "track-4-step-2-1",
    text: "Running 상태인 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태인 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-4-step-2-2",
    text: "에러 상태인 파드가 없는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const errorStatuses = [
        "Error",
        "ImagePullBackOff",
        "ErrImagePull",
        "CrashLoopBackOff",
      ];
      const errorPods = pods.filter((pod) =>
        errorStatuses.includes(pod.status)
      );
      if (errorPods.length === 0) {
        return {
          isCorrect: true,
          message: "정답입니다! 에러 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: `에러 상태인 파드가 있습니다: ${errorPods.map((p) => `${p.name}(${p.status})`).join(", ")}`,
      };
    },
  },
  // Track 4 - Step 3 (PVC/PV)
  {
    id: "track-4-step-3-1",
    text: "모든 파드가 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Running 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Running 상태가 아닙니다. Running: ${runningPods.length}/${pods.length}`,
      };
    },
  },
  {
    id: "track-4-step-3-2",
    text: "재시작 횟수가 0인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const noRestartPods = pods.filter((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts === 0;
      });
      if (noRestartPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 재시작 횟수가 0인 파드가 ${noRestartPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "재시작 횟수가 0인 파드가 없습니다.",
      };
    },
  },
  // Track 4 - Step 4 (환경변수 주입)
  {
    id: "track-4-step-4-1",
    text: "Running 상태인 파드가 최소 2개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 2) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `Running 상태인 파드가 2개 미만입니다. 현재: ${runningPods.length}개`,
      };
    },
  },
  {
    id: "track-4-step-4-2",
    text: "모든 파드가 Ready이고 Running 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyPods = pods.filter((pod) => {
        const isRunning = pod.status === "Running";
        const isReady =
          pod.ready.includes("/") && !pod.ready.startsWith("0/");
        return isRunning && isReady;
      });
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready이고 Running 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready이거나 Running 상태가 아닙니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 4 - Step 5 (설정 관리 실습)
  {
    id: "track-4-step-5-1",
    text: "클러스터에 노드와 파드가 모두 존재하는가?",
    checkAnswer: (nodes, pods) => {
      const hasNodes = nodes && nodes.length > 0;
      const hasPods = pods && pods.length > 0;
      if (hasNodes && hasPods) {
        return {
          isCorrect: true,
          message: `정답입니다! 노드 ${nodes.length}개, 파드 ${pods.length}개가 있습니다.`,
        };
      }
      if (!hasNodes && !hasPods) {
        return {
          isCorrect: false,
          message: "노드와 파드가 모두 없습니다.",
        };
      }
      if (!hasNodes) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: "파드가 없습니다.",
      };
    },
  },
  {
    id: "track-4-step-5-2",
    text: "모든 파드가 정상 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyStatuses = ["Running", "Completed", "Succeeded"];
      const healthyPods = pods.filter((pod) =>
        healthyStatuses.includes(pod.status)
      );
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 정상 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 비정상 상태입니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 5 - Step 1 (장애 진단)
  {
    id: "track-5-step-1-1",
    text: "클러스터에 파드가 존재하는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다. kubectl get pods 명령어를 실행해보세요.",
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! 현재 ${pods.length}개의 파드가 있습니다.`,
      };
    },
  },
  {
    id: "track-5-step-1-2",
    text: "에러 상태인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const errorStatuses = [
        "Error",
        "ImagePullBackOff",
        "ErrImagePull",
        "CrashLoopBackOff",
        "Pending",
      ];
      const errorPods = pods.filter((pod) =>
        errorStatuses.includes(pod.status)
      );
      if (errorPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 에러 상태인 파드가 ${errorPods.length}개 있습니다: ${errorPods.map((p) => `${p.name}(${p.status})`).join(", ")}`,
        };
      }
      return {
        isCorrect: false,
        message: "에러 상태인 파드가 없습니다. 모든 파드가 정상입니다.",
      };
    },
  },
  // Track 5 - Step 2 (CrashLoopBackOff)
  {
    id: "track-5-step-2-1",
    text: "CrashLoopBackOff 상태인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const crashPods = pods.filter(
        (pod) => pod.status === "CrashLoopBackOff"
      );
      if (crashPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! CrashLoopBackOff 상태인 파드가 ${crashPods.length}개 있습니다: ${crashPods.map((p) => p.name).join(", ")}`,
        };
      }
      return {
        isCorrect: false,
        message: "CrashLoopBackOff 상태인 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-5-step-2-2",
    text: "재시작 횟수가 3회 이상인 파드가 있는가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const highRestartPods = pods.filter((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts >= 3;
      });
      if (highRestartPods.length > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! 재시작 횟수가 3회 이상인 파드가 ${highRestartPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "재시작 횟수가 3회 이상인 파드가 없습니다.",
      };
    },
  },
  // Track 5 - Step 3 (리소스 최적화)
  {
    id: "track-5-step-3-1",
    text: "Running 상태인 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const runningPods = pods.filter((pod) => pod.status === "Running");
      if (runningPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! ${runningPods.length}개의 Running 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태인 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-5-step-3-2",
    text: "모든 파드가 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const readyPods = pods.filter((pod) => {
        return pod.ready.includes("/") && !pod.ready.startsWith("0/");
      });
      if (readyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Ready 상태가 아닙니다. Ready: ${readyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 5 - Step 4 (Helm 배포)
  {
    id: "track-5-step-4-1",
    text: "Deployment로 생성된 파드가 최소 1개 이상인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const deploymentPods = pods.filter((pod) => {
        const parts = pod.name.split("-");
        return parts.length >= 3;
      });
      if (deploymentPods.length >= 1) {
        return {
          isCorrect: true,
          message: `정답입니다! Deployment로 생성된 파드가 ${deploymentPods.length}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Deployment로 생성된 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-5-step-4-2",
    text: "모든 파드가 Running이고 Ready 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyPods = pods.filter((pod) => {
        const isRunning = pod.status === "Running";
        const isReady =
          pod.ready.includes("/") && !pod.ready.startsWith("0/");
        return isRunning && isReady;
      });
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 Running이고 Ready 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 Running이거나 Ready 상태가 아닙니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
  // Track 5 - Step 5 (종합 실습)
  {
    id: "track-5-step-5-1",
    text: "클러스터에 노드와 파드가 모두 존재하는가?",
    checkAnswer: (nodes, pods) => {
      const hasNodes = nodes && nodes.length > 0;
      const hasPods = pods && pods.length > 0;
      if (hasNodes && hasPods) {
        return {
          isCorrect: true,
          message: `정답입니다! 노드 ${nodes.length}개, 파드 ${pods.length}개가 있습니다.`,
        };
      }
      if (!hasNodes && !hasPods) {
        return {
          isCorrect: false,
          message: "노드와 파드가 모두 없습니다.",
        };
      }
      if (!hasNodes) {
        return {
          isCorrect: false,
          message: "노드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: "파드가 없습니다.",
      };
    },
  },
  {
    id: "track-5-step-5-2",
    text: "모든 파드가 정상 상태인가?",
    checkAnswer: (nodes, pods) => {
      if (!pods || pods.length === 0) {
        return {
          isCorrect: false,
          message: "파드가 없습니다.",
        };
      }
      const healthyStatuses = ["Running", "Completed", "Succeeded"];
      const healthyPods = pods.filter((pod) =>
        healthyStatuses.includes(pod.status)
      );
      if (healthyPods.length === pods.length) {
        return {
          isCorrect: true,
          message: `정답입니다! 모든 파드(${pods.length}개)가 정상 상태입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `일부 파드가 비정상 상태입니다. 정상: ${healthyPods.length}/${pods.length}`,
      };
    },
  },
];

