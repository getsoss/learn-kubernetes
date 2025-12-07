import { ParsedNode, ParsedPod } from "../types/kubectl";

export type ProblemContext = {
  nodes: ParsedNode[] | null;
  pods: ParsedPod[] | null;
};

export type ProblemSubmission = {
  selectedOptionId?: string;
  textAnswer?: string;
};

export type ProblemResult = {
  isCorrect: boolean;
  message: string;
};

export type ProblemOption = {
  id: string;
  label: string;
};

export type ProblemType = "state-check" | "multiple-choice" | "text-input";

export type Problem = {
  id: string;
  text: string;
  type?: ProblemType;
  options?: ProblemOption[];
  placeholder?: string;
  generateOptions?: (context: ProblemContext) => ProblemOption[];
  checkAnswer: (
    context: ProblemContext,
    submission?: ProblemSubmission
  ) => ProblemResult;
};

const podsUnavailable: ProblemResult = {
  isCorrect: false,
  message: "파드 정보가 없습니다. kubectl get pods 로 확인해보세요.",
};

const nodesUnavailable: ProblemResult = {
  isCorrect: false,
  message: "노드 정보가 없습니다. kubectl get nodes 로 확인해보세요.",
};

const parseAgeToSeconds = (age: string): number => {
  if (!age) return Number.MAX_SAFE_INTEGER;
  const regex = /(\d+)([smhd])/g;
  let match: RegExpExecArray | null;
  let total = 0;
  const unitSeconds: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  while ((match = regex.exec(age)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    total += value * (unitSeconds[unit] || 0);
  }

  if (total === 0) {
    const fallback = parseInt(age, 10);
    if (!Number.isNaN(fallback)) {
      return fallback;
    }
    return Number.MAX_SAFE_INTEGER;
  }

  return total;
};

const getMostRecentPodName = (pods: ParsedPod[] | null): string | null => {
  if (!pods || pods.length === 0) return null;

  let latestPod = pods[0];
  let latestAge = parseAgeToSeconds(latestPod.age);

  pods.forEach((pod) => {
    const podAge = parseAgeToSeconds(pod.age);
    if (podAge < latestAge) {
      latestPod = pod;
      latestAge = podAge;
    }
  });

  return latestPod.name;
};

export const problems: Problem[] = [
  {
    id: "track-1-step-1-1",
    text: "nginx 이미지를 사용한 Pod YAML을 적용해 파드를 만드세요. (힌트: kubectl apply -f nginx.yaml)",
    checkAnswer: ({ pods }) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const nginxPod = pods.find((pod) => pod.name.includes("nginx"));
      if (!nginxPod) {
        return {
          isCorrect: false,
          message:
            "nginx 이름을 포함한 파드를 찾을 수 없습니다. kubectl run nginx --image=nginx 명령을 실행해보세요.",
        };
      }
      if (nginxPod.status !== "Running") {
        return {
          isCorrect: false,
          message: `nginx 파드가 아직 Running 상태가 아닙니다. 현재 상태: ${nginxPod.status}`,
        };
      }
      return {
        isCorrect: true,
        message: `정답입니다! ${nginxPod.name} 파드가 Running 상태입니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-2",
    text: "현재 Running 상태인 파드는 몇 개인가요? (kubectl get pods 로 확인)",
    type: "multiple-choice",
    generateOptions: ({ pods }) => {
      const runningCount = pods?.filter((pod) => pod.status === "Running").length ?? 0;
      return [
        { id: "running-0", label: "0개" },
        { id: "running-1", label: "1개" },
      ];
    },
    checkAnswer: ({ pods }, submission) => {
      if (!pods) return podsUnavailable;
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const runningCount = pods.filter((pod) => pod.status === "Running").length;
      const selectedValue = submission.selectedOptionId === "running-0" ? 0 : 1;
      if (runningCount === selectedValue) {
        return {
          isCorrect: true,
          message: `정답입니다! Running 상태 파드가 ${runningCount}개입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `오답입니다. 현재 Running 파드 수는 ${runningCount}개입니다. kubectl get pods 로 다시 확인해보세요.`,
      };
    },
  },
  {
    id: "track-1-step-1-3",
    text: "Running 상태 파드가 1개 이상인가?",
    type: "multiple-choice",
    options: [
      { id: "running-0", label: "0개" },
      { id: "running-1", label: "1개 이상" },
    ],
    checkAnswer: ({ pods }, submission) => {
      if (!pods) return podsUnavailable;
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const runningCount = pods.filter((pod) => pod.status === "Running").length;
      const wantsNonZero = submission.selectedOptionId === "running-1";
      if ((runningCount > 0) === wantsNonZero) {
        return {
          isCorrect: true,
          message: wantsNonZero
            ? `정답입니다! Running 상태 파드가 ${runningCount}개 있습니다.`
            : "정답입니다! Running 상태 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: wantsNonZero
          ? "오답입니다. Running 상태 파드가 존재하지 않습니다."
          : "오답입니다. 이미 Running 상태 파드가 있습니다.",
      };
    },
  },
  {
    id: "track-1-step-1-4",
    text: "CrashLoopBackOff 상태인 busybox 파드가 있는가요?",
    type: "multiple-choice",
    options: [
      { id: "yes", label: "예" },
      { id: "no", label: "아니오" },
    ],
    checkAnswer: ({ pods }, submission) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const exists = pods.some((pod) => pod.status === "CrashLoopBackOff");
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const wantsYes = submission.selectedOptionId === "yes";
      if (exists === wantsYes) {
        return {
          isCorrect: true,
          message: exists
            ? "정답입니다! CrashLoopBackOff 상태인 파드가 존재합니다."
            : "정답입니다! CrashLoopBackOff 상태인 파드가 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: exists
          ? "오답입니다. CrashLoopBackOff 파드가 존재합니다."
          : "오답입니다. CrashLoopBackOff 파드가 없습니다.",
      };
    },
  },
  {
    id: "track-1-step-1-5",
    text: "재시작 횟수가 2 이상인 파드 이름은 무엇인가요?",
    type: "text-input",
    placeholder: "예: busybox",
    checkAnswer: ({ pods }, submission) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const highRestart = pods.find((pod) => {
        const restarts = parseInt(pod.restarts) || 0;
        return restarts >= 2;
      });
      if (!highRestart) {
        return {
          isCorrect: false,
          message: "재시작 2회 이상인 파드를 찾을 수 없습니다.",
        };
      }
      const answer = submission?.textAnswer?.trim();
      if (!answer) {
        return {
          isCorrect: false,
          message: "파드 이름을 입력해주세요.",
        };
      }
      if (answer === highRestart.name) {
        return {
          isCorrect: true,
          message: `정답입니다! ${highRestart.name} 파드가 ${highRestart.restarts}회 재시작되었습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `오답입니다. 재시작 2회 이상인 파드는 ${highRestart.name} 입니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-6",
    text: "nginx-error.yaml을 수정해 nginx-error 파드를 Running 상태로 되돌리세요. (kubectl apply -f nginx-error.yaml 확인 후 nano 에디터로 편집 이후 kubectl apply -f nginx-error.yaml)",
    checkAnswer: ({ pods }) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const nginxError = pods.find((pod) => pod.name.includes("nginx-error"));
      if (!nginxError) {
        return {
          isCorrect: false,
          message: "nginx-error 파드를 찾을 수 없습니다. yaml을 적용했는지 확인하세요.",
        };
      }
      if (nginxError.status === "Running") {
        return {
          isCorrect: true,
          message: "정답입니다! nginx-error 파드가 정상적으로 Running 상태입니다.",
        };
      }
      return {
        isCorrect: false,
        message: `nginx-error 파드가 아직 ${nginxError.status} 상태입니다. 이미지 이름 등을 확인하고 다시 적용하세요.`,
      };
    },
  },
  {
    id: "track-2-step-1-1",
    text: "control-plane 노드는 Ready 상태인가요? (kubectl get nodes)",
    type: "multiple-choice",
    options: [
      { id: "yes", label: "예" },
      { id: "no", label: "아니오" },
    ],
    checkAnswer: ({ nodes }, submission) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const controlPlane = nodes.find((node) => node.name.includes("control-plane"));
      if (!controlPlane) {
        return {
          isCorrect: false,
          message: "control-plane 노드를 찾을 수 없습니다.",
        };
      }
      const isReady = controlPlane.status.includes("Ready") && !controlPlane.status.includes("NotReady");
      const answeredYes = submission.selectedOptionId === "yes";
      if (isReady === answeredYes) {
        return {
          isCorrect: true,
          message: isReady
            ? "정답입니다! control-plane 노드가 Ready 상태입니다."
            : "정답입니다! control-plane 노드가 Ready 상태가 아닙니다.",
        };
      }
      return {
        isCorrect: false,
        message: isReady
          ? "오답입니다. 현재 노드는 Ready 상태입니다."
          : "오답입니다. 현재 노드는 Ready 상태가 아닙니다.",
      };
    },
  },
  {
    id: "track-2-step-1-2",
    text: "control-plane 노드를 cordon 했나요? (kubectl cordon control-plane)",
    type: "multiple-choice",
    options: [
      { id: "cordoned", label: "예" },
      { id: "not", label: "아니오" },
    ],
    checkAnswer: ({ nodes }, submission) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const controlPlane = nodes.find((node) => node.name.includes("control-plane"));
      if (!controlPlane) {
        return {
          isCorrect: false,
          message: "control-plane 노드를 찾을 수 없습니다.",
        };
      }
      const disabled = controlPlane.status.includes("SchedulingDisabled");
      const choseCordoned = submission.selectedOptionId === "cordoned";
      if (disabled === choseCordoned) {
        return {
          isCorrect: true,
          message: disabled
            ? "정답입니다! 노드가 cordon 상태입니다. 유지보수 중 새 파드가 배치되지 않도록 막을 때 cordon을 사용합니다."
            : "정답입니다! 노드가 cordon 되어 있지 않습니다. 새 파드 배치를 막으려면 cordon을 걸어야 합니다.",
        };
      }
      return {
        isCorrect: false,
        message: disabled
          ? "오답입니다. 현재 노드는 cordon 상태입니다. 점검 시 새 파드가 올라오지 않도록 막을 때 cordon을 사용합니다."
          : "오답입니다. 현재 노드는 cordon 되어 있지 않습니다. 새 파드 배치를 막으려면 cordon을 걸어야 합니다.",
      };
    },
  },
  {
    id: "track-2-step-1-3",
    text: "control-plane 노드를 uncordon 했나요? (kubectl uncordon control-plane)",
    type: "multiple-choice",
    options: [
      { id: "yes", label: "예" },
      { id: "no", label: "아니오" },
    ],
    checkAnswer: ({ nodes }, submission) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const controlPlane = nodes.find((node) => node.name.includes("control-plane"));
      if (!controlPlane) {
        return {
          isCorrect: false,
          message: "control-plane 노드를 찾을 수 없습니다.",
        };
      }
      const schedulingDisabled = controlPlane.status.includes("SchedulingDisabled");
      const answeredYes = submission.selectedOptionId === "yes";
      const uncordoned = !schedulingDisabled;
      if (uncordoned === answeredYes) {
        return {
          isCorrect: true,
          message: uncordoned
            ? "정답입니다! 노드가 uncordon 상태라서 새 파드를 다시 받을 수 있습니다. 점검이 끝났다면 cordon을 해제해 스케줄러가 노드를 활용하도록 해야 합니다."
            : "정답입니다! 아직 uncordon 하지 않아 새 파드를 막고 있습니다.",
        };
      }
      return {
        isCorrect: false,
        message: uncordoned
          ? "오답입니다. 이미 uncordon 되어 있어 새 파드를 받을 수 있습니다."
          : "오답입니다. 아직 노드가 cordon 상태입니다. 점검이 끝났다면 uncordon 해서 스케줄러가 노드를 다시 사용하도록 해야 합니다.",
      };
    },
  },
  {
    id: "track-2-step-1-4",
    text: "control-plane 노드에 env=dev 라벨을 추가했나요? (kubectl label nodes control-plane env=dev && kubectl get nodes --show-labels)",
    type: "multiple-choice",
    options: [
      { id: "labeled", label: "예" },
      { id: "not", label: "아니오" },
    ],
    checkAnswer: ({ nodes }, submission) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      if (!submission?.selectedOptionId) {
        return {
          isCorrect: false,
          message: "보기를 선택한 뒤 정답 확인을 눌러주세요.",
        };
      }
      const controlPlane = nodes.find((node) => node.name.includes("control-plane"));
      if (!controlPlane) {
        return {
          isCorrect: false,
          message: "control-plane 노드를 찾을 수 없습니다.",
        };
      }
      const labelList = controlPlane.labels
        ?.split(",")
        .map((label) => label.trim())
        .filter(Boolean);
      const hasEnvDev = labelList?.includes("env=dev") ?? false;
      const choseLabeled = submission.selectedOptionId === "labeled";
      if (hasEnvDev === choseLabeled) {
        return {
          isCorrect: true,
          message: hasEnvDev
            ? "정답입니다! env=dev 라벨이 추가되었습니다. 라벨을 붙이면 특정 환경(예: dev)만 골라 스케줄링하거나 셀렉터로 타겟팅할 수 있습니다."
            : "정답입니다! env=dev 라벨이 아직 없습니다.",
        };
      }
      return {
        isCorrect: false,
        message: hasEnvDev
          ? "오답입니다. 이미 env=dev 라벨이 있어 특정 환경용으로 노드를 구분할 수 있습니다."
          : "오답입니다. 아직 env=dev 라벨이 없습니다. 환경별로 노드를 구분하려면 라벨을 추가해야 합니다.",
      };
    },
  },
];
