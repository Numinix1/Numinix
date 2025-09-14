import React, { createContext, useContext, useState } from 'react';
import { DiagnosticQuestion, DiagnosticResult } from '../types';

interface DiagnosticTestState {
  questions: DiagnosticQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<DiagnosticQuestion[]>>;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  answers: { questionId: string; answer: string; correct: boolean }[];
  setAnswers: React.Dispatch<React.SetStateAction<{ questionId: string; answer: string; correct: boolean }[]>>;
  selectedAnswer: string;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  testStarted: boolean;
  setTestStarted: React.Dispatch<React.SetStateAction<boolean>>;
  finalResult: DiagnosticResult | null;
  setFinalResult: React.Dispatch<React.SetStateAction<DiagnosticResult | null>>;
}

const DiagnosticTestContext = createContext<DiagnosticTestState | undefined>(undefined);

export function DiagnosticTestProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; correct: boolean }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [finalResult, setFinalResult] = useState<DiagnosticResult | null>(null);

  return (
    <DiagnosticTestContext.Provider value={{
      questions, setQuestions,
      currentQuestion, setCurrentQuestion,
      answers, setAnswers,
      selectedAnswer, setSelectedAnswer,
      showResult, setShowResult,
      timeLeft, setTimeLeft,
      loading, setLoading,
      testStarted, setTestStarted,
      finalResult, setFinalResult
    }}>
      {children}
    </DiagnosticTestContext.Provider>
  );
}

export function useDiagnosticTest() {
  const context = useContext(DiagnosticTestContext);
  if (!context) throw new Error('useDiagnosticTest must be used within a DiagnosticTestProvider');
  return context;
}
