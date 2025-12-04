-- 유저별 문제 풀이 결과를 저장하는 테이블
-- Supabase auth.users 테이블과 연동

-- 문제 풀이 결과 테이블
CREATE TABLE IF NOT EXISTS user_problem_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 한 유저가 같은 문제를 여러 번 풀 수 있지만, 최신 결과만 유지하거나
  -- 모든 시도 기록을 유지할 수 있습니다.
  -- 여기서는 최신 결과만 유지하는 방식으로 UNIQUE 제약 추가
  CONSTRAINT unique_user_problem UNIQUE(user_id, problem_id)
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_problem_results_user_id ON user_problem_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_results_problem_id ON user_problem_results(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_results_is_correct ON user_problem_results(user_id, is_correct);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_user_problem_results_updated_at
  BEFORE UPDATE ON user_problem_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_problem_results ENABLE ROW LEVEL SECURITY;

-- 유저는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view their own problem results"
  ON user_problem_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own problem results"
  ON user_problem_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problem results"
  ON user_problem_results
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 선택사항: 모든 시도 기록을 저장하려면 아래 테이블 사용
-- (위의 UNIQUE 제약을 제거하고 이 테이블 사용)
CREATE TABLE IF NOT EXISTS user_problem_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_problem_attempts_user_id ON user_problem_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_attempts_problem_id ON user_problem_attempts(problem_id);
-- 복합 인덱스 (user_id와 problem_id를 함께 조회할 때 성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_problem_attempts_user_problem ON user_problem_attempts(user_id, problem_id);

ALTER TABLE user_problem_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own problem attempts"
  ON user_problem_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own problem attempts"
  ON user_problem_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

