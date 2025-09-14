import React, { useEffect } from 'react';
import { Brain, Clock, CheckCircle, XCircle, Sparkles, Trophy, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateDiagnosticTest, analyzeDiagnosticResults } from '../../services/diagnosticService';
import { DiagnosticQuestion, DiagnosticResult } from '../../types';
import { useDiagnosticTest } from '../../context/DiagnosticTestContext';

interface DiagnosticTestProps {
  onComplete: (result: DiagnosticResult) => void;
  onSkip: () => void;
}

export function DiagnosticTest({ onComplete, onSkip }: DiagnosticTestProps) {
  const { userProfile } = useAuth();
  const {
    questions, setQuestions,
    currentQuestion, setCurrentQuestion,
    answers, setAnswers,
    selectedAnswer, setSelectedAnswer,
    showResult, setShowResult,
    timeLeft, setTimeLeft,
    loading, setLoading,
    testStarted, setTestStarted,
    finalResult, setFinalResult
  } = useDiagnosticTest();

  useEffect(() => {
    if (userProfile && !testStarted) {
      loadDiagnosticTest();
    }
  }, [userProfile, testStarted]);

  useEffect(() => {
    if (testStarted && timeLeft > 0 && currentQuestion < questions.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion < questions.length) {
      handleTimeUp();
    }
  }, [timeLeft, testStarted, currentQuestion, questions.length]);

  const loadDiagnosticTest = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const diagnosticQuestions = await generateDiagnosticTest(userProfile.class_level);
      setQuestions(diagnosticQuestions);
    } catch (error) {
      console.error('Error loading diagnostic test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit current answer or mark as incorrect
    if (selectedAnswer) {
      handleAnswer();
    } else {
      const currentQ = questions[currentQuestion];
      setAnswers(prev => [...prev, {
        questionId: currentQ.id,
        answer: '',
        correct: false
      }]);
      nextQuestion();
    }
  };

  const handleAnswer = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    
    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      answer: selectedAnswer,
      correct: isCorrect
    }]);

    setShowResult(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    if (!userProfile) return;
    
    try {
      const result = await analyzeDiagnosticResults(answers, questions);
      result.user_id = userProfile.id;
      setFinalResult(result);
      onComplete(result);
    } catch (error) {
      console.error('Error analyzing results:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Preparing Your Diagnostic Test</h2>
          <p className="text-gray-300 text-lg">Creating personalized questions just for you...</p>
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

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-2xl mx-4 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
            <Target className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
            Welcome to Your Math Journey! 🚀
          </h1>
          
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Let's start with a quick diagnostic test to understand your current level and create a personalized learning path just for you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl mb-3">📝</div>
              <div className="text-lg font-bold text-blue-300 mb-2">30 Questions</div>
              <div className="text-sm text-blue-200">Carefully selected to assess your knowledge</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-3xl mb-3">⏱️</div>
              <div className="text-lg font-bold text-purple-300 mb-2">45 Minutes</div>
              <div className="text-sm text-purple-200">Plenty of time to think through each question</div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/40 to-green-900/40 rounded-2xl p-6 border border-emerald-500/30">
              <div className="text-3xl mb-3">🎯</div>
              <div className="text-lg font-bold text-emerald-300 mb-2">Personalized</div>
              <div className="text-sm text-emerald-200">Results will customize your learning experience</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setTestStarted(true)}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6 rounded-2xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>Start Diagnostic Test</span>
                <ArrowRight className="h-6 w-6" />
              </div>
            </button>
            
            <button
              onClick={onSkip}
              className="w-full bg-gray-700 text-gray-300 py-4 rounded-2xl hover:bg-gray-600 transition-all duration-300 font-semibold"
            >
              Skip for now (Not recommended)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finalResult) {
    const percentage = Math.round((finalResult.score / finalResult.total_questions) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-2xl mx-4">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">Diagnostic Complete! 🎉</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{finalResult.score}/{finalResult.total_questions}</div>
              <div className="text-blue-200">Questions Correct</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-2xl p-6 border border-green-500/30">
              <div className="text-3xl font-bold text-green-400">{percentage}%</div>
              <div className="text-green-200">Overall Score</div>
            </div>
          </div>

          {finalResult.strengths.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 mb-6 border border-emerald-500/20">
              <h3 className="text-xl font-bold text-emerald-300 mb-3 flex items-center justify-center space-x-2">
                <CheckCircle className="h-6 w-6" />
                <span>Your Strengths</span>
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {finalResult.strengths.map((strength, index) => (
                  <span key={index} className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-2xl p-6 mb-8 border border-purple-500/20">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Your Personalized Recommendations</h3>
            <div className="space-y-3">
              {finalResult.recommendations.map((rec, index) => (
                <div key={index} className="text-purple-100 text-left bg-purple-800/20 p-3 rounded-lg">
                  {rec}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onComplete(finalResult)}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl hover:from-blue-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-2xl"
          >
            Continue to Your Personalized MathMap 🗺️
          </button>
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
            Skip for now
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
              <span>Diagnostic Test</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className={`font-mono text-lg font-bold ${timeLeft <= 300 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                  {formatTime(timeLeft)}
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