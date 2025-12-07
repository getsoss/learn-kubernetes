import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface UserProblemResult {
  id: number;
  user_id: string;
  problem_id: string;
  is_correct: boolean;
  message: string | null;
  created_at: string;
  updated_at: string;
}
