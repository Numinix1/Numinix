import React, { useState, useEffect } from 'react';
import { Brain, Clock, CheckCircle, XCircle, Sparkles, Trophy, Target, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProgressTrackingService, ChapterDiagnostic } from '../../services/progressTrackingService';
import { generateDiagnosticTest } from '../../services/diagnosticService';
import { DiagnosticQuestion } from '../../types';

interface ChapterDiagnosticTestProps {
  chapterId: string;
  chapterName: string;
  onComplete: (diagnostic: ChapterDiagnostic) => void;
  onSkip: () => void;
}

export function ChapterDiagnosticTest({ chapterId, chapterName, onComplete, onSkip }: ChapterDiagnosticTestProps) {
  const { userProfile } = useAuth();
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; correct: boolean; timeSpent: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile && !testStarted) {
      loadDiagnosticTest();
    }
  }, [userProfile, testStarted]);

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResult && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, testStarted, showResult, questions.length]);

  const loadDiagnosticTest = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const diagnosticQuestions = await generateDiagnosticTest(userProfile.class_level);
      setQuestions(diagnosticQuestions.slice(0, 15)); // 15 questions for chapter diagnostic
    } catch (error) {
      console.error('Error loading diagnostic test:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    if (!userProfile) return;
    
    setTestStarted(true);
    setStartTime(new Date());
    setQuestionStartTime(new Date());
    
    // Start study session tracking
    try {
      const sessionId = await ProgressTrackingService.startStudySession({
        user_id: userProfile.id,
        session_type: 'diagnostic',
        chapter_id: chapterId,
        topic: chapterName,
        started_at: new Date().toISOString(),
        questions_attempted: 0,
        questions_correct: 0,
        concepts_covered: []
      });
      setSessionId(sessionId);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer) {
      handleAnswer();
    } else {
      const currentQ = questions[currentQuestion];
      const timeSpent = questionStartTime ? (new Date().getTime() - questionStartTime.getTime()) / 1000 : 30;
      
      setAnswers(prev => [...prev, {
        questionId: currentQ.id,
        answer: '',
        correct: false,
        timeSpent
      }]);
      
      // Record the attempt
      recordQuestionAttempt(currentQ, '', false, timeSpent);
      nextQuestion();
    }
  };

  const handleAnswer = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    const timeSpent = questionStartTime ? (new Date().getTime() - questionStartTime.getTime()) / 1000 : 0;
    
    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent
    }]);

    // Record the attempt
    recordQuestionAttempt(currentQ, selectedAnswer, isCorrect, timeSpent);
    
    setShowResult(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const recordQuestionAttempt = async (question: DiagnosticQuestion, userAnswer: string, isCorrect: boolean, timeSpent: number) => {
    if (!userProfile || !sessionId) return;
    
    try {
      await ProgressTrackingService.recordQuestionAttempt({
        user_id: userProfile.id,
        question_id: question.id,
        question_text: question.question,
        question_type: 'diagnostic',
        chapter_id: chapterId,
        topic: question.topic,
        concept: question.concept,
        difficulty: question.difficulty,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        time_taken_seconds: Math.floor(timeSpent),
        hints_used: 0,
        attempts_count: 1,
        confidence_level: 3,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error recording question attempt:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(30);
      setQuestionStartTime(new Date());
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    if (!userProfile || !startTime) return;
    
    const endTime = new Date();
    const totalTimeMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
    const correctAnswers = answers.filter(a => a.correct).length;
    const scorePercentage = (correctAnswers / questions.length) * 100;
    
    // Analyze results
    const conceptPerformance: { [key: string]: { correct: number; total: number } } = {};
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {};
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      if (!question) return;
      
      // Track concept performance
      if (!conceptPerformance[question.concept]) {
        conceptPerformance[question.concept] = { correct: 0, total: 0 };
      }
      conceptPerformance[question.concept].total++;
      if (answer.correct) conceptPerformance[question.concept].correct++;
      
      // Track topic performance
      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (answer.correct) topicPerformance[question.topic].correct++;
    });
    
    // Identify strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const knowledgeGaps: string[] = [];
    
    Object.entries(conceptPerformance).forEach(([concept, performance]) => {
      const accuracy = (performance.correct / performance.total) * 100;
      if (accuracy >= 80) {
        strengths.push(concept);
      } else if (accuracy >= 50) {
        // Moderate performance
      } else {
        weaknesses.push(concept);
        if (accuracy < 30) {
          knowledgeGaps.push(concept);
        }
      }
    });
    
    // Determine difficulty level
    let difficultyLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (scorePercentage >= 80) difficultyLevel = 'advanced';
    else if (scorePercentage >= 60) difficultyLevel = 'intermediate';
    
    // Create diagnostic result
    const diagnostic: ChapterDiagnostic = {
      user_id: userProfile.id,
      chapter_id: chapterId,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      time_taken_minutes: totalTimeMinutes,
      strengths,
      weaknesses,
      knowledge_gaps: knowledgeGaps,
      prerequisite_concepts: knowledgeGaps, // For now, gaps are prerequisites
      difficulty_level: difficultyLevel,
      raw_responses: {
        answers,
        conceptPerformance,
        topicPerformance
      }
    };
    
    // Save diagnostic results
    try {
      await ProgressTrackingService.saveChapterDiagnostic(diagnostic);
      
      // End study session
      if (sessionId) {
        await ProgressTrackingService.endStudySession(sessionId, {
          duration_minutes: totalTimeMinutes,
          questions_attempted: questions.length,
          questions_correct: correctAnswers,
          concepts_covered: Object.keys(conceptPerformance)
        });
      }
      
      onComplete(diagnostic);
    } catch (error) {
      console.error('Error saving diagnostic:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Preparing Chapter Diagnostic</h2>
          <p className="text-gray-300 text-lg">Creating personalized assessment for {chapterName}...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-2xl mx-4 w-full relative z-10">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
            <Target className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
            Chapter Diagnostic Test 🎯
          </h1>
          
          <h2 className="text-2xl font-bold text-white mb-4">{chapterName}</h2>
          
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Before diving into this chapter, let's assess your readiness and create a personalized learning path!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl mb-3">📝</div>
              <div className="text-lg font-bold text-blue-300 mb-2">15 Questions</div>
              <div className="text-sm text-blue-200">Focused on chapter prerequisites</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-3xl mb-3">⏱️</div>
              <div className="text-lg font-bold text-purple-300 mb-2">30 sec/question</div>
              <div className="text-sm text-purple-200">Quick assessment format</div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/40 to-green-900/40 rounded-2xl p-6 border border-emerald-500/30">
              <div className="text-3xl mb-3">🗺️</div>
              <div className="text-lg font-bold text-emerald-300 mb-2">Custom Path</div>
              <div className="text-sm text-emerald-200">AI-generated study roadmap</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={startTest}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6 rounded-2xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>Start Chapter Assessment</span>
                <ArrowRight className="h-6 w-6" />
              </div>
            </button>
            
            <button
              onClick={onSkip}
              className="w-full bg-gray-700 text-gray-300 py-4 rounded-2xl hover:bg-gray-600 transition-all duration-300 font-semibold"
            >
              Skip Assessment (Not recommended)
            </button>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-500/20">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              <span className="font-bold text-yellow-300">Why take this assessment?</span>
            </div>
            <ul className="text-sm text-yellow-200 space-y-2 text-left">
              <li>• Identifies your current knowledge level</li>
              <li>• Creates personalized study recommendations</li>
              <li>• Highlights areas that need extra attention</li>
              <li>• Optimizes your learning path for better results</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">No Questions Available</h2>
          <p className="text-gray-300 mb-6">Unable to load diagnostic questions. Please try again.</p>
          <button
            onClick={onSkip}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Skip Assessment
          </button>
        </div>
      </div>
    );
  }
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Brain className="h-8 w-8 text-emerald-400" />
              <span>Chapter Assessment: {chapterName}</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className={`font-mono text-lg font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="text-lg bg-black/20 rounded-full px-4 py-2 text-white font-semibold">
                {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 rounded-full text-sm font-bold">
                {currentQ.topic}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-full text-sm font-bold">
                {currentQ.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-relaxed mb-6">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            {currentQ.options?.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-6 text-left rounded-2xl border-2 transition-all transform hover:scale-102 font-semibold text-lg ${
                  showResult
                    ? option === currentQ.correct_answer
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-green-900/40 text-emerald-300'
                      : option === selectedAnswer && option !== currentQ.correct_answer
                      ? 'border-red-500 bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300'
                      : 'border-gray-600 bg-gray-800/20 text-gray-400'
                    : selectedAnswer === option
                    ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 shadow-xl transform scale-102'
                    : 'border-gray-600/50 hover:border-blue-400 hover:bg-blue-900/20 text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      showResult && option === currentQ.correct_answer
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : showResult && option === selectedAnswer && option !== currentQ.correct_answer
                        ? 'border-red-500 bg-red-500 text-white'
                        : selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-500 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                  {showResult && option === currentQ.correct_answer && (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  )}
                  {showResult && option === selectedAnswer && option !== currentQ.correct_answer && (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-500/30 mb-6">
              <h3 className="font-bold text-blue-300 mb-3 flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Explanation:</span>
              </h3>
              <p className="text-blue-100 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}