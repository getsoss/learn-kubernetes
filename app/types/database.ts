// Supabase 데이터베이스 타입 정의
// supabase gen types typescript --project-id YOUR_PROJECT_ID 명령어로 자동 생성 가능

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_problem_results: {
        Row: {
          id: number;
          user_id: string;
          problem_id: string;
          is_correct: boolean;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          problem_id: string;
          is_correct: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          problem_id?: string;
          is_correct?: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
