import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Coins, Clock, CheckCircle, XCircle, Trophy, ArrowLeft, Sparkles, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Question } from '../../types';
import chaptersData from '../../data/chapters.json';
import questions9 from '../../data/questions9.json';

export function Quiz() {
  const { userProfile, updateUserStats } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [showChapterSelector, setShowChapterSelector] = useState(true);
  const [questionSource, setQuestionSource] = useState<'ai' | 'preloaded' | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for pre-selected chapters from localStorage
  useEffect(() => {
    const savedChapters = localStorage.getItem('selectedChapterForQuiz');
    if (savedChapters) {
      try {
        const chapters = JSON.parse(savedChapters);
        setSelectedChapters(chapters);
        localStorage.removeItem('selectedChapterForQuiz');
      } catch (error) {
        console.error('Error parsing saved chapters:', error);
      }
    }
  }, []);

  const userClassChapters = chaptersData.filter(
    chapter => chapter.class_level === userProfile?.class_level
  );
  
  const unlockedChapters = userClassChapters.filter(chapter => 
    userProfile?.unlocked_chapters?.includes(chapter.id) || chapter.order === 1
  );

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizComplete && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleAnswer();
    }
  }, [timeLeft, showResult, quizComplete, questions.length]);

  // Enhanced Modal for question source selection
  if (questionSource === null) {
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

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4 relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Crown className="h-12 w-12 text-yellow-400 animate-bounce" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Challenge
            </h2>
            <Crown className="h-12 w-12 text-yellow-400 animate-bounce" />
          </div>
          
          <p className="text-gray-300 text-lg mb-8">Select your preferred question source for the ultimate math challenge!</p>
          
          <div className="space-y-4">
            <button
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:from-blue-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              onClick={() => setQuestionSource('ai')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>🤖 AI Generated Questions</span>
                <Zap className="h-6 w-6 animate-bounce" />
              </div>
              <div className="text-sm text-blue-100 mt-2">
                Questions made only for you.
              </div>
            </button>
            
            <button
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              onClick={() => setQuestionSource('preloaded')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Trophy className="h-6 w-6 animate-pulse" />
                <span>📚 Curated Questions</span>
                <CheckCircle className="h-6 w-6 animate-bounce" />
              </div>
              <div className="text-sm text-gray-300 mt-2">Expertly crafted problems</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced generateQuiz function
  const generateQuiz = async () => {
    if (!userProfile?.class_level || selectedChapters.length === 0) return;
    setError(null);
    setIsGenerating(true);

    if (questionSource === 'ai') {
      try {
        const { generateQuestions } = await import('../../services/aiService');
        // Pass userProfile and selectedChapters for personalization
        const generatedQuestions = await generateQuestions(userProfile, selectedChapters);
        console.log('AI generatedQuestions:', generatedQuestions);
        setQuestions(generatedQuestions.slice(0, 10));
      } catch (err) {
        setError('Network error. Please check your connection and try again.');
        setQuestions([]);
      }
    } else if (questionSource === 'preloaded') {
      // Filter preloaded questions by selected chapters
      let availableQuestions = questions9.filter(q =>
        selectedChapters.some(chapterId => {
          const chapter = chaptersData.find(c => c.id === chapterId);
          return chapter && q.chapter && (q.chapter === chapter.chapter || q.chapter === chapterId);
        }) && !usedQuestionIds.includes(q.id)
      );
      
      // If all questions used, reset pool
      if (availableQuestions.length === 0) {
        setUsedQuestionIds([]);
        availableQuestions = questions9.filter(q =>
          selectedChapters.some(chapterId => {
            const chapter = chaptersData.find(c => c.id === chapterId);
            return chapter && q.chapter && (q.chapter === chapter.chapter || q.chapter === chapterId);
          })
        );
      }
      
      // Shuffle and pick 10 random questions
      const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 10).map(q => ({
        ...q,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
      }));
      setQuestions(selected);
      setUsedQuestionIds(prev => [...prev, ...selected.map(q => q.id)]);
    }
    
    setIsGenerating(false);
  };

  const handleAnswer = () => {
    setShowResult(true);
    const isCorrect = selectedAnswer === questions[currentQuestion]?.correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    // Record question attempt for personalization
    if (userProfile) {
      recordQuestionAttempt(isCorrect);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
        setTimeLeft(30);
      } else {
        completeQuiz();
      }
    }, 2000);
  };

  const recordQuestionAttempt = async (isCorrect: boolean) => {
    if (!userProfile) return;
    
    const current = questions[currentQuestion];
    try {
      const { ProgressTrackingService } = await import('../../services/progressTrackingService');
      await ProgressTrackingService.recordQuestionAttempt({
        user_id: userProfile.id,
        question_id: current.id,
        question_text: current.question,
        question_type: 'quiz',
        chapter_id: selectedChapters[0], // Use first selected chapter
        topic: current.topic,
        concept: current.topic, // Use topic as concept for now
        difficulty: current.difficulty,
        user_answer: selectedAnswer,
        correct_answer: current.correct_answer,
        is_correct: isCorrect,
        time_taken_seconds: 30 - timeLeft,
        hints_used: 0,
        attempts_count: 1,
        confidence_level: 3
      });
    } catch (error) {
      console.error('Error recording question attempt:', error);
    }
  };
  const completeQuiz = () => {
    setQuizComplete(true);
    let coinsEarned = Math.floor(score * 2 + questions.length * 0.5);
    if (score === questions.length) {
      coinsEarned += 100; // perfect score bonus
    }
    updateUserStats(score, wrongCount, coinsEarned);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
    setWrongCount(0);
    setTimeLeft(30);
    setShowChapterSelector(true);
    setSelectedChapters([]);
    setQuestionSource(null);
  };

  // Enhanced Chapter Selector
  if (showChapterSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
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

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                    Choose Quiz Chapters
                  </h2>
                  <p className="text-gray-300 text-lg">Select which chapters to include in your mathematical adventure</p>
                </div>
                <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h3 className="font-bold text-white text-xl mb-6 flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <span>Available Chapters:</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unlockedChapters.map((chapter) => (
                  <label
                    key={chapter.id}
                    className="group flex items-center space-x-4 p-6 bg-black/20 backdrop-blur-sm rounded-2xl hover:bg-blue-900/20 transition-all duration-300 cursor-pointer border border-white/10 hover:border-blue-400/50 hover:scale-105"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChapters.includes(chapter.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedChapters([...selectedChapters, chapter.id]);
                        } else {
                          setSelectedChapters(selectedChapters.filter(id => id !== chapter.id));
                        }
                      }}
                      className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                        {chapter.chapter}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {chapter.topics.slice(0, 2).join(', ')}
                        {chapter.topics.length > 2 && ` +${chapter.topics.length - 2} more`}
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  if (selectedChapters.length > 0) {
                    setShowChapterSelector(false);
                    generateQuiz();
                  }
                }}
                disabled={selectedChapters.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl hover:from-blue-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <Zap className="h-6 w-6 animate-bounce" />
                  <span>Start Quiz ({selectedChapters.length} chapter{selectedChapters.length !== 1 ? 's' : ''})</span>
                  <Crown className="h-6 w-6 animate-pulse" />
                </div>
              </button>
              
              <button
                onClick={() => setSelectedChapters(unlockedChapters.map(c => c.id))}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                ✨ Select All Chapters
              </button>
              
              {selectedChapters.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-4">
                  Please select at least one chapter to start the quiz
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Loading screen for AI questions
  if (questions.length === 0 && questionSource === 'ai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4 relative z-10">
          {error ? (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <XCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-300 whitespace-pre-line mb-8 leading-relaxed">{error}</p>
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                🔄 Try Again
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Generating Your Quiz...
              </h2>
              <p className="text-gray-300 text-lg mb-6">Our AI is crafting personalized questions just for you!</p>
              <div className="flex items-center justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (questions.length === 0 && questionSource === 'preloaded') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center pb-20">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">No Questions Available</h2>
          <p className="text-gray-300 mb-6">No preloaded questions found for selected chapters.</p>
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Enhanced Quiz Complete Screen
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let coinsEarned = score * 2 + questions.length * 0.5;
    if (score === questions.length) {
      coinsEarned += 100;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center pb-20 relative overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🎉', '🏆', '⭐', '🎊', '✨'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4 w-full relative z-10">
          <div className="mb-10">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
              <Trophy className="h-16 w-16 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Quiz Complete! 🎉
            </h2>
            <p className="text-gray-300 text-xl">Outstanding mathematical performance!</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 backdrop-blur-sm border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{score}/{questions.length}</div>
              <div className="text-sm text-blue-200">Correct Answers</div>
            </div>
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-2xl p-6 backdrop-blur-sm border border-green-500/30">
              <div className="text-3xl font-bold text-green-400">{percentage}%</div>
              <div className="text-sm text-green-200">Accuracy</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-2xl p-8 mb-10 border border-yellow-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Coins className="h-8 w-8 text-yellow-400 animate-bounce" />
              <span className="text-3xl font-bold text-yellow-400">+{coinsEarned}</span>
              <span className="text-yellow-300 text-xl">coins earned!</span>
            </div>
            {score === questions.length && (
              <div className="text-sm text-orange-400 font-medium animate-pulse">
                🎉 Perfect score bonus: +100 coins!
              </div>
            )}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl hover:from-blue-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold text-xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <Zap className="h-6 w-6 animate-bounce" />
              <span>Take Another Quiz</span>
              <Crown className="h-6 w-6 animate-pulse" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
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

      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Enhanced Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center space-x-3">
                  <Trophy className="h-8 w-8 animate-bounce" />
                  <span>Quiz Arena</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20">
                    <Clock className="h-5 w-5" />
                    <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="text-lg bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 font-semibold">
                    {currentQuestion + 1} of {questions.length}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-white via-yellow-300 to-green-400 h-4 rounded-full transition-all duration-300 shadow-sm relative overflow-hidden"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Question */}
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-full text-sm font-bold backdrop-blur-sm border border-blue-400/30">
                  📚 {current.topic}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm font-bold backdrop-blur-sm border border-purple-400/30">
                  ⚡ {current.difficulty}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full text-sm font-bold backdrop-blur-sm border border-green-400/30">
                  🎯 Class {current.class_level}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-4">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{current.question}</ReactMarkdown>
                </div>
              </h2>
            </div>

            <div className="space-y-4">
              {current.options?.map((option, index) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all transform hover:scale-102 active:scale-98 font-semibold text-lg ${
                    showResult
                      ? option === current.correct_answer
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-green-900/40 text-emerald-300 shadow-xl backdrop-blur-sm'
                        : option === selectedAnswer && option !== current.correct_answer
                        ? 'border-red-500 bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 backdrop-blur-sm'
                        : 'border-gray-600 bg-gray-800/20 text-gray-400 backdrop-blur-sm'
                      : selectedAnswer === option
                      ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 shadow-xl transform scale-102 backdrop-blur-sm'
                      : 'border-gray-600/50 hover:border-blue-400 hover:bg-blue-900/20 text-gray-200 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                        showResult && option === current.correct_answer
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : showResult && option === selectedAnswer && option !== current.correct_answer
                          ? 'border-red-500 bg-red-500 text-white'
                          : selectedAnswer === option
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-500 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                    {showResult && option === current.correct_answer && (
                      <CheckCircle className="h-6 w-6 text-emerald-400 animate-bounce" />
                    )}
                    {showResult && option === selectedAnswer && option !== current.correct_answer && (
                      <XCircle className="h-6 w-6 text-red-400 animate-pulse" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-8 p-8 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                <h3 className="font-bold text-blue-300 mb-4 flex items-center space-x-2 text-xl">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  <span>Explanation:</span>
                </h3>
                <div className="prose prose-invert max-w-none" style={{color: 'white'}}>
                  <ReactMarkdown>{current.explanation}</ReactMarkdown>
                </div>
              </div>
            )}

            {!showResult && (
              <button
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-2xl hover:from-blue-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <Zap className="h-6 w-6 animate-bounce" />
                  <span>Submit Answer</span>
                  <Crown className="h-6 w-6 animate-pulse" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}