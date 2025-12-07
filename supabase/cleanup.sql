-- 기존 테이블이 있다면 삭제하는 스크립트
-- 문제가 있을 때만 실행하세요

DROP TABLE IF EXISTS user_problem_attempts CASCADE;
DROP TABLE IF EXISTS user_problem_results CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;


