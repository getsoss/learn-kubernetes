# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 API URL과 anon key를 복사합니다.

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 SQL Editor로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.

또는 Supabase CLI를 사용하는 경우:

```bash
supabase db push
```

## 4. 패키지 설치

```bash
npm install @supabase/supabase-js
```

## 5. 사용 방법

### 문제 결과 저장

```typescript
import { saveProblemResult } from '@/app/lib/problemResults';

// 유저가 문제를 풀었을 때
await saveProblemResult(
  userId,
  'track-1-step-1-1',
  true, // 정답 여부
  '정답입니다!'
);
```

### 문제 결과 조회

```typescript
import { getUserProblemResults } from '@/app/lib/problemResults';

// 유저의 모든 문제 결과 조회
const results = await getUserProblemResults(userId);
// 결과: { 'track-1-step-1-1': { isCorrect: true, message: '...' }, ... }
```

### 스텝 완료 상태 조회

```typescript
import { getStepCompletionStatus } from '@/app/lib/problemResults';

const stepProblemIds = ['track-1-step-1-1', 'track-1-step-1-2', 'track-1-step-1-3'];
const status = await getStepCompletionStatus(userId, stepProblemIds);
// 결과: { isCompleted: true, completedCount: 3, totalCount: 3 }
```

## 6. RLS (Row Level Security) 정책

스키마에 포함된 RLS 정책으로:
- 유저는 자신의 데이터만 조회/수정할 수 있습니다.
- 인증된 유저만 데이터를 삽입할 수 있습니다.

## 7. 인증 설정 (선택사항)

Supabase Auth를 사용하여 유저 인증을 구현할 수 있습니다:

```typescript
import { supabase } from '@/app/lib/supabase';

// 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// 현재 유저 조회
const { data: { user } } = await supabase.auth.getUser();
```

## 8. 데이터베이스 구조

### user_problem_results 테이블
- **최신 결과만 유지**: 같은 문제를 여러 번 풀어도 최신 결과만 저장됩니다.
- **UNIQUE 제약**: (user_id, problem_id) 조합이 유일합니다.

### user_problem_attempts 테이블 (선택사항)
- **모든 시도 기록 저장**: 모든 풀이 시도를 기록합니다.
- 문제를 여러 번 풀 수 있고, 시도 횟수 통계 등을 확인할 수 있습니다.

## 9. 성능 최적화

- 인덱스가 자동으로 생성되어 빠른 조회가 가능합니다.
- `user_id`와 `problem_id`로 필터링할 때 인덱스를 사용합니다.


