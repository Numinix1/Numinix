import React from 'react';
import { TrendingUp, Target, Award, BarChart3, Sparkles, Crown, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Progress() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const totalQuestions = userProfile.total_correct + userProfile.total_wrong;
  const accuracy = totalQuestions > 0 ? Math.round((userProfile.total_correct / totalQuestions) * 100) : 0;

  const stats = [
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: Target,
      color: 'blue',
    },
    {
      title: 'Accuracy Rate',
      value: `${accuracy}%`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Stars Collected',
      value: userProfile.stars,
      icon: Award,
      color: 'yellow',
    },
    {
      title: 'Correct Answers',
      value: userProfile.total_correct,
      icon: BarChart3,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.4 + 0.1})`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating Progress Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['📈', '🏆', '⭐', '🎯', '📊', '💎'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Your Progress Journey
              </h1>
              <p className="text-emerald-200 text-lg">Track your mathematical mastery and achievements</p>
            </div>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat) => (
          <div key={stat.title} className="group bg-black/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 hover:border-white/40 hover:scale-105">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
              <stat.icon className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{stat.value}</div>
            <div className="text-lg text-gray-300 group-hover:text-gray-200 transition-colors flex items-center space-x-2">
              <span>{stat.title}</span>
              <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>
          </div>
        ))}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              <span>Performance Overview</span>
              <Zap className="h-5 w-5 text-yellow-400 animate-bounce" />
            </h2>
            <div className="space-y-8">
            <div>
              <div className="flex justify-between text-lg mb-4">
                <span className="text-gray-300 font-medium">Correct Answers</span>
                <span className="font-bold text-green-400">{userProfile.total_correct}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                  style={{
                    width: totalQuestions > 0 ? `${(userProfile.total_correct / totalQuestions) * 100}%` : '0%'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-lg mb-4">
                <span className="text-gray-300 font-medium">Wrong Answers</span>
                <span className="font-bold text-red-400">{userProfile.total_wrong}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-4 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                  style={{
                    width: totalQuestions > 0 ? `${(userProfile.total_wrong / totalQuestions) * 100}%` : '0%'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
              <Award className="h-6 w-6 text-yellow-400" />
              <span>Achievements</span>
              <Crown className="h-5 w-5 text-yellow-400 animate-pulse" />
            </h2>
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl transition-all duration-300 ${userProfile.stars >= 10 ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 shadow-lg' : 'bg-white/5 border border-white/10'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-lg">Star Collector</span>
                <span className="text-sm text-gray-300">Earn 10 stars</span>
              </div>
              {userProfile.stars >= 10 && (
                <div className="text-sm text-yellow-400 mt-3 flex items-center space-x-2">
                  <Trophy className="h-4 w-4 animate-bounce" />
                  <span className="font-bold">✓ Achieved!</span>
                </div>
              )}
            </div>
            
            <div className={`p-6 rounded-2xl transition-all duration-300 ${accuracy >= 80 ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 shadow-lg' : 'bg-white/5 border border-white/10'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-lg">Accuracy Master</span>
                <span className="text-sm text-gray-300">80% accuracy</span>
              </div>
              {accuracy >= 80 && (
                <div className="text-sm text-green-400 mt-3 flex items-center space-x-2">
                  <Trophy className="h-4 w-4 animate-bounce" />
                  <span className="font-bold">✓ Achieved!</span>
                </div>
              )}
            </div>
            
            <div className={`p-6 rounded-2xl transition-all duration-300 ${userProfile.total_correct >= 50 ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-lg' : 'bg-white/5 border border-white/10'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-lg">Problem Solver</span>
                <span className="text-sm text-gray-300">50 correct answers</span>
              </div>
              {(userProfile.total_correct_answers || 0) >= 50 && (
                <div className="text-sm text-blue-400 mt-3 flex items-center space-x-2">
                  <Trophy className="h-4 w-4 animate-bounce" />
                  <span className="font-bold">✓ Achieved!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        .animate-float {
          animation: float 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}