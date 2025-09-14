export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  class_level: number;
  total_coins: number;
  total_correct: number;
  total_wrong: number;
  avatar_id: number;
  unlocked_chapters: string[];
  created_at: string;
  diagnostic_completed?: boolean;
  chapter_stars?: { [chapterId: string]: number };
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  class_level: number;
  topic: string;
  chapter: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  questions: Question[];
  score: number;
  money_earned: number;
  completed_at: string;
}

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  category: string;
}

export interface Chapter {
  id: string;
  class_level: number;
  subject: string;
  unit?: string;
  chapter: string;
  topics: string[];
  unlock_cost: number;
  order: number;
  required_stars?: number;
}

export interface Avatar {
  id: number;
  name: string;
  image: string;
  cost: number;
  unlocked: boolean;
}

export interface TimerSession {
  id: string;
  user_id: string;
  duration: number;
  completed: boolean;
  created_at: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  concept: string;
}

export interface DiagnosticResult {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
  recommendations: string[];
  completed_at: string;
}

export interface StudyPlan {
  chapter_id: string;
  prerequisites: string[];
  recommended_practice: string[];
  estimated_time: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChapterProgress {
  chapter_id: string;
  completion_percentage: number;
  mastery_level: number;
  time_spent: number;
  last_accessed: string;
  quiz_scores: number[];
  practice_completed: number;
}