import { Problem } from "../data/problems";

export type ChapterGroup = {
  chapterId: string;
  chapterName: string;
  problems: Problem[];
};

/**
 * 문제 ID에서 챕터 정보를 추출합니다.
 * 예: "track-1-step-3-1" -> { track: "1", step: "3" }
 */
function extractChapterInfo(problemId: string): {
  track: string;
  step: string;
} | null {
  const match = problemId.match(/^track-(\d+)-step-(\d+)/);
  if (!match) return null;
  return {
    track: match[1],
    step: match[2],
  };
}

/**
 * 챕터 이름을 생성합니다.
 */
function getChapterName(track: string, step: string): string {
  const trackNames: Record<string, string> = {
    "1": "Track 1. 쿠버네티스 기초 입문",
    "2": "Track 2. 워크로드 관리",
    "3": "Track 3. 네트워킹 & 서비스 연결",
    "4": "Track 4. 스토리지 & 설정 관리",
    "5": "Track 5. 고급 운영 실습",
  };

  const stepNames: Record<string, Record<string, string>> = {
    "1": {
      "1": "컨테이너와 Pod 개념",
      "2": "kubectl 기초",
      "3": "Pod 생성/확인",
      "4": "로그/디버깅",
      "5": "정리/퀴즈",
    },
    "2": {
      "1": "Deployment 개념",
      "2": "배포/스케일링",
      "3": "롤링 업데이트",
      "4": "롤백 전략",
      "5": "YAML 베스트프랙티스",
    },
    "3": {
      "1": "Service 개념",
      "2": "ClusterIP/NodePort",
      "3": "Ingress 기초",
      "4": "문제해결 패턴",
      "5": "아키텍처 정리",
    },
    "4": {
      "1": "ConfigMap/Secret",
      "2": "Volume 기초",
      "3": "PVC/PV",
      "4": "환경변수 주입",
      "5": "설정 관리 실습",
    },
    "5": {
      "1": "장애 진단",
      "2": "리소스 최적화",
      "3": "Helm 배포",
      "4": "모니터링",
      "5": "종합 실습",
    },
  };

  const trackName = trackNames[track] || `Track ${track}`;
  const stepName = stepNames[track]?.[step] || `Step ${step}`;
  return `${trackName} - ${stepName}`;
}

/**
 * 문제 배열을 챕터별로 그룹화합니다.
 */
export function groupProblemsByChapter(problems: Problem[]): ChapterGroup[] {
  const chapterMap = new Map<string, Problem[]>();

  problems.forEach((problem) => {
    const chapterInfo = extractChapterInfo(problem.id);
    if (!chapterInfo) {
      // 챕터 정보를 추출할 수 없는 경우 "기타" 챕터로 분류
      const otherChapterId = "other";
      if (!chapterMap.has(otherChapterId)) {
        chapterMap.set(otherChapterId, []);
      }
      chapterMap.get(otherChapterId)!.push(problem);
      return;
    }

    const chapterId = `track-${chapterInfo.track}-step-${chapterInfo.step}`;
    if (!chapterMap.has(chapterId)) {
      chapterMap.set(chapterId, []);
    }
    chapterMap.get(chapterId)!.push(problem);
  });

  // 챕터를 정렬하여 반환
  const chapters: ChapterGroup[] = Array.from(chapterMap.entries())
    .map(([chapterId, problems]) => {
      const chapterInfo = extractChapterInfo(problems[0]?.id || "");
      let chapterName = "기타 문제";
      
      if (chapterInfo) {
        chapterName = getChapterName(chapterInfo.track, chapterInfo.step);
      }

      return {
        chapterId,
        chapterName,
        problems,
      };
    })
    .sort((a, b) => {
      // track과 step 순서로 정렬
      const aMatch = a.chapterId.match(/track-(\d+)-step-(\d+)/);
      const bMatch = b.chapterId.match(/track-(\d+)-step-(\d+)/);
      
      if (!aMatch) return 1;
      if (!bMatch) return -1;
      
      const aTrack = parseInt(aMatch[1]);
      const bTrack = parseInt(bMatch[1]);
      if (aTrack !== bTrack) return aTrack - bTrack;
      
      const aStep = parseInt(aMatch[2]);
      const bStep = parseInt(bMatch[2]);
      return aStep - bStep;
    });

  return chapters;
}

