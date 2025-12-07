import { supabase, UserProblemResult } from "./supabase";

/**
 * 유저의 문제 풀이 결과를 저장합니다 (최신 결과만 유지)
 */
export async function saveProblemResult(
  userId: string,
  problemId: string,
  isCorrect: boolean,
  message?: string
): Promise<UserProblemResult | null> {
  try {
    const { data, error } = await supabase
      .from("user_problem_results")
      .upsert(
        {
          user_id: userId,
          problem_id: problemId,
          is_correct: isCorrect,
          message: message || null,
        },
        {
          onConflict: "user_id,problem_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("문제 결과 저장 실패:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("문제 결과 저장 중 오류:", error);
    return null;
  }
}

/**
 * 유저의 모든 문제 풀이 결과를 조회합니다
 */
export async function getUserProblemResults(
  userId: string
): Promise<Record<string, { isCorrect: boolean; message: string } | null>> {
  try {
    const { data, error } = await supabase
      .from("user_problem_results")
      .select("problem_id, is_correct, message")
      .eq("user_id", userId);

    if (error) {
      console.error("문제 결과 조회 실패:", error);
      return {};
    }

    // Record 형태로 변환
    const results: Record<
      string,
      { isCorrect: boolean; message: string } | null
    > = {};

    if (data) {
      data.forEach((result) => {
        results[result.problem_id] = {
          isCorrect: result.is_correct,
          message: result.message || "",
        };
      });
    }

    return results;
  } catch (error) {
    console.error("문제 결과 조회 중 오류:", error);
    return {};
  }
}

/**
 * 특정 문제의 풀이 결과를 조회합니다
 */
export async function getProblemResult(
  userId: string,
  problemId: string
): Promise<{ isCorrect: boolean; message: string } | null> {
  try {
    const { data, error } = await supabase
      .from("user_problem_results")
      .select("is_correct, message")
      .eq("user_id", userId)
      .eq("problem_id", problemId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      isCorrect: data.is_correct,
      message: data.message || "",
    };
  } catch (error) {
    console.error("문제 결과 조회 중 오류:", error);
    return null;
  }
}

/**
 * 유저의 스텝별 완료 상태를 조회합니다
 */
export async function getStepCompletionStatus(
  userId: string,
  stepProblemIds: string[]
): Promise<{
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}> {
  try {
    const { data, error } = await supabase
      .from("user_problem_results")
      .select("problem_id, is_correct")
      .eq("user_id", userId)
      .in("problem_id", stepProblemIds)
      .eq("is_correct", true);

    if (error) {
      console.error("스텝 완료 상태 조회 실패:", error);
      return {
        isCompleted: false,
        completedCount: 0,
        totalCount: stepProblemIds.length,
      };
    }

    const completedCount = data?.length || 0;
    const totalCount = stepProblemIds.length;

    return {
      isCompleted: completedCount === totalCount && totalCount > 0,
      completedCount,
      totalCount,
    };
  } catch (error) {
    console.error("스텝 완료 상태 조회 중 오류:", error);
    return {
      isCompleted: false,
      completedCount: 0,
      totalCount: stepProblemIds.length,
    };
  }
}

/**
 * 유저의 트랙별 완료 상태를 조회합니다
 */
export async function getTrackCompletionStatus(
  userId: string,
  trackProblemIds: string[]
): Promise<{
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}> {
  return getStepCompletionStatus(userId, trackProblemIds);
}
