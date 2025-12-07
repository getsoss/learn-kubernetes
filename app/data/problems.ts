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
    text: "클러스터에 노드가 최소 1개 이상 존재하는가?",
    checkAnswer: ({ nodes }) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      return {
        isCorrect: true,
        message: `정답입니다! ${nodes.length}개의 노드가 있습니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-2",
    text: "현재 파드 수는 얼마인가?",
    type: "multiple-choice",
    generateOptions: ({ pods }) => {
      const count = pods?.length ?? 0;
      return [
        { id: `count-${count}`, label: `${count}개` },
        { id: `count-${count + 1}`, label: `${count + 1}개` },
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
      const actual = pods.length;
      const selectedValue = submission.selectedOptionId.replace("count-", "");
      if (selectedValue === String(actual)) {
        return {
          isCorrect: true,
          message: `정답입니다! 현재 ${actual}개의 파드가 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `오답입니다. 실제 파드 수는 ${actual}개입니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-3",
    text: "Running 상태 파드가 1개 이상인가?",
    checkAnswer: ({ pods }) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const runningCount = pods.filter(
        (pod) => pod.status === "Running"
      ).length;
      if (runningCount > 0) {
        return {
          isCorrect: true,
          message: `정답입니다! Running 상태 파드가 ${runningCount}개 있습니다.`,
        };
      }
      return {
        isCorrect: false,
        message: "Running 상태 파드가 없습니다. 상태를 다시 확인해보세요.",
      };
    },
  },
  {
    id: "track-1-step-1-4",
    text: "가장 최근에 생성된 파드 이름은 무엇인가요?",
    type: "text-input",
    placeholder: "예: nginx-abc123",
    checkAnswer: ({ pods }, submission) => {
      if (!pods || pods.length === 0) {
        return podsUnavailable;
      }
      const latestName = getMostRecentPodName(pods);
      if (!latestName) {
        return {
          isCorrect: false,
          message: "최근 생성된 파드를 찾을 수 없습니다.",
        };
      }
      const answer = submission?.textAnswer?.trim();
      if (!answer) {
        return {
          isCorrect: false,
          message: "파드 이름을 입력해주세요.",
        };
      }
      if (answer === latestName) {
        return {
          isCorrect: true,
          message: `정답입니다! 가장 최근 파드는 ${latestName} 입니다.`,
        };
      }
      return {
        isCorrect: false,
        message: `오답입니다. 최근 파드는 ${latestName} 입니다.`,
      };
    },
  },
  {
    id: "track-1-step-1-5",
    text: "클러스터 노드가 Ready 상태인가?",
    checkAnswer: ({ nodes }) => {
      if (!nodes || nodes.length === 0) {
        return nodesUnavailable;
      }
      const readyNodes = nodes.filter((node) => node.status === "Ready");
      if (readyNodes.length === nodes.length) {
        return {
          isCorrect: true,
          message: "정답입니다! 모든 노드가 Ready 상태입니다.",
        };
      }
      return {
        isCorrect: false,
        message: `일부 노드가 Ready 상태가 아닙니다. Ready: ${readyNodes.length}/${nodes.length}`,
      };
    },
  },
];
