import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          class_level: number;
          current_chapter_id?: string;
          total_coins: number;
          total_questions_solved: number;
          total_correct_answers: number;
          overall_accuracy: number;
          learning_preferences: any;
          unlocked_chapters: string[];
          completed_chapters: string[];
          avatar_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          class_level: number;
          current_chapter_id?: string;
          total_coins?: number;
          total_questions_solved?: number;
          total_correct_answers?: number;
          overall_accuracy?: number;
          learning_preferences?: any;
          unlocked_chapters?: string[];
          completed_chapters?: string[];
          avatar_id?: number;
        };
        Update: {
          current_chapter_id?: string;
          total_coins?: number;
          total_questions_solved?: number;
          total_correct_answers?: number;
          overall_accuracy?: number;
          learning_preferences?: any;
          unlocked_chapters?: string[];
          completed_chapters?: string[];
          avatar_id?: number;
        };
      };
      chapters: {
        Row: {
          id: string;
          class_level: number;
          chapter_name: string;
          chapter_number: number;
          description: string;
          prerequisite_concepts: string[];
          learning_objectives: string[];
          estimated_duration_hours: number;
          unlock_requirements: any;
          is_active: boolean;
          created_at: string;
        };
      };
      diagnostic_results: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          total_questions: number;
          correct_answers: number;
          score_percentage: number;
          time_taken_minutes: number;
          strengths: string[];
          weaknesses: string[];
          knowledge_gaps: string[];
          prerequisite_gaps: string[];
          ai_analysis: string;
          completed_at: string;
        };
      };
      learning_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          roadmap_data: any;
          focus_areas: string[];
          improvement_plan: any[];
          estimated_completion_days: number;
          current_step: number;
          total_steps: number;
          completion_percentage: number;
          last_updated: string;
          created_at: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          total_questions: number;
          money_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          total_questions: number;
          money_earned: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          score?: number;
          total_questions?: number;
          money_earned?: number;
        };
      };
    };
  };
};