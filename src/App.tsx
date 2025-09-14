import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AITutorProvider } from './context/AITutorContext';
import { Header } from './components/Layout/Header';
import { BottomNavigation } from './components/Layout/BottomNavigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AITutor } from './components/AITutor/AITutor';
import { Games } from './components/Games/Games';
import { Quiz } from './components/Quiz/Quiz';
import { Tools } from './components/Tools/Tools';
import { Progress } from './components/Progress/Progress';
import { Profile } from './components/Profile/Profile';
import { MathMap } from './components/MathMap/MathMap';
import { Timer } from './components/Timer/Timer';
import { AuthModal } from './components/Auth/AuthModal';
import { ResetPassword } from './components/Auth/ResetPassword';
import { BookOpen, Star, Play, Brain, Sparkles, Zap, Trophy } from 'lucide-react';

type LandingPageProps = {
  showAuthDefault?: boolean;
};

function LandingPage({ showAuthDefault = false }: LandingPageProps) {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(() => {
    if (showAuthDefault) return true;
    if (localStorage.getItem('showAuthModal') === 'true') {
      localStorage.removeItem('showAuthModal');
      return true;
    }
    return false;
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
      navigate('/');
    }
  }, [user, navigate]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <nav className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Numinix
              </span>
              <div className="text-xs sm:text-sm text-gray-500">Learn • Play • Grow</div>
            </div>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-xl text-sm sm:text-base"
          >
            Get Started
          </button>
        </div>
      </nav>

  <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 pb-20 md:pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-10"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Math Universe
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Embark on an epic mathematical journey with AI tutoring, earn coins, unlock chapters, and master mathematics from Class 1-12.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110 shadow-2xl"
          >
            Begin Your Journey
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">AI-Powered Learning</h3>
            <p className="text-gray-600 leading-relaxed">Get instant step-by-step solutions with our advanced AI tutor that adapts to your learning style.</p>
          </div>
          
          <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-violet-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Chapter-Based Journey</h3>
            <p className="text-gray-600 leading-relaxed">Progress through chapters, earn coins, and unlock new mathematical concepts in a structured way.</p>
          </div>
          
          <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">Monitor your journey with detailed analytics, achievements, and personalized learning paths.</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-6 right-6 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  NCERT Curriculum
                  <span className="block text-blue-600">Perfectly Aligned</span>
                </h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Complete coverage of mathematics syllabus from Class 1 to 12, organized in an engaging chapter-based progression system.
                </p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                    <span className="text-lg">Chapter-based progression system</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                    <span className="text-lg">Coin-based unlock mechanism</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                    <span className="text-lg">Comprehensive progress tracking</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-sm border border-blue-200/50">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Chapter-Based Learning</h3>
                <p className="text-gray-600 text-lg">From Basic Numbers to Advanced Calculus</p>
              </div>
            </div>
          </div>
        </div>
      </main>

  <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultMode={showAuthDefault ? "signin" : "signup"} />
      
  <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showNavigation, setShowNavigation] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin shadow-xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg">Loading Numinix...</p>
        </div>
      </div>
    );
  }

  // Show LandingPage (with login modal) on any route if not logged in
  if (!user) {
    return <LandingPage showAuthDefault={true} />;
  }

  return (
    <AITutorProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <main className="relative pb-20 md:pb-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/games" element={<Games />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/math-map" element={<MathMap setShowNavigation={setShowNavigation} />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {showNavigation && <BottomNavigation />}
      </div>
    </AITutorProvider>
  );
}

import { DiagnosticTestProvider } from './context/DiagnosticTestContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DiagnosticTestProvider>
          <Routes>
            <Route path="/auth" element={<LandingPage showAuthDefault={true} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<AppContent />} />
          </Routes>
        </DiagnosticTestProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;