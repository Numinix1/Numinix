import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Gamepad2, Map, Trophy, Target, TrendingUp, Timer, Sparkles, Coins, Star, Award, Zap, Crown, Rocket, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FeatureCard } from './FeatureCard';
import motivationalQuotes from '../../data/motivationalQuotes.json';
import avatarsData from '../../data/avatars.json';

export function Dashboard() {
  const { userProfile } = useAuth();
  const [currentQuote, setCurrentQuote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const features = [
    {
      title: 'AI Tutor',
      description: 'Get instant step-by-step solutions',
      icon: Calculator,
      gradient: 'from-emerald-500 to-teal-600',
      path: '/ai-tutor',
    },
    {
      title: 'Quiz Arena',
      description: 'Test knowledge & earn coins',
      icon: Trophy,
      gradient: 'from-amber-500 to-orange-600',
      path: '/quiz',
    },
    {
      title: 'Math Games',
      description: 'Fun puzzles & brain teasers',
      icon: Gamepad2,
      gradient: 'from-violet-500 to-purple-600',
      path: '/games',
    },
    {
      title: 'Math Universe',
      description: 'Explore your learning journey',
      icon: Map,
      gradient: 'from-indigo-500 to-blue-600',
      path: '/math-map',
    },
    {
      title: 'Focus Timer',
      description: 'Beautiful study sessions',
      icon: Timer,
      gradient: 'from-rose-500 to-pink-600',
      path: '/timer',
    },
    {
      title: 'Math Tools',
      description: 'Calculators & converters',
      icon: Target,
      gradient: 'from-cyan-500 to-blue-500',
      path: '/tools',
    },
  ];

  const currentAvatar = avatarsData.find(a => a.id === userProfile?.avatar_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pb-20 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.4 + 0.1})`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating Mathematical Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['∑', '∫', 'π', '∞', '√', '∆', 'θ', 'α', 'β', 'γ'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-4xl font-bold animate-float"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Enhanced Welcome Section */}
        <div className="mb-12">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Magical floating elements */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce"></div>
            <div className="absolute bottom-8 left-8 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400/50 rounded-full animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-8 sm:space-y-0">
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-4 mb-6">
                    <div className="relative">
                      <div className="text-6xl animate-bounce">{currentAvatar?.image || '🧮'}</div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Welcome back, {userProfile?.name}! ✨
                      </h1>
                      <p className="text-blue-200 text-lg flex items-center space-x-2">
                        <Rocket className="h-5 w-5 text-blue-400" />
                        <span>Class {userProfile?.class_level} • Ready for mathematical adventures?</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                      <span className="font-bold text-purple-300 text-lg">Daily Inspiration</span>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-purple-100 text-lg italic leading-relaxed font-medium">{currentQuote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        {userProfile && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-yellow-400/50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Coins className="h-7 w-7 text-white animate-bounce" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{userProfile.total_coins || userProfile.money || 0}</div>
                  <div className="text-sm text-yellow-200">Coins</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-yellow-300/80">Keep solving to earn more! 💰</div>
            </div>
            
            <div className="group bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">{userProfile.total_correct}</div>
                  <div className="text-sm text-green-200">Correct</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-300/80">Amazing progress! 🎯</div>
            </div>
            
            <div className="group bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-400/50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Star className="h-7 w-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{userProfile.unlocked_chapters?.length || 1}</div>
                  <div className="text-sm text-blue-200">Chapters</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-300/80">Unlock more adventures! 🚀</div>
            </div>
            
            <div className="group bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-purple-400/50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white animate-bounce" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                    {(userProfile.total_correct || 0) + (userProfile.total_wrong || 0) > 0 
                      ? Math.round(((userProfile.total_correct || 0) / ((userProfile.total_correct || 0) + (userProfile.total_wrong || 0))) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-purple-200">Accuracy</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-purple-300/80">Keep improving! ⚡</div>
            </div>
          </div>
        )}

        {/* Enhanced Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <FeatureCard key={feature.path} {...feature} />
          ))}
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden"
               onClick={() => navigate('/quiz')}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center space-x-2">
                    <Trophy className="h-6 w-6 animate-bounce" />
                    <span>Quick Quiz</span>
                  </h3>
                  <p className="text-blue-100 text-lg mb-4">Test your knowledge and earn coins!</p>
                  <div className="flex items-center space-x-2 text-sm bg-white/20 rounded-full px-4 py-2 w-fit">
                    <Coins className="h-4 w-4" />
                    <span>Earn up to 50 coins</span>
                  </div>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                  🏆
                </div>
              </div>
            </div>
          </div>
          
    <div className="group bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden"
      onClick={() => navigate('/ai-tutor')}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center space-x-2">
                    <Calculator className="h-6 w-6 animate-pulse" />
                    <span>Ask AI Tutor</span>
                  </h3>
                  <p className="text-emerald-100 text-lg mb-4">Get instant step-by-step solutions!</p>
                  <div className="flex items-center space-x-2 text-sm bg-white/20 rounded-full px-4 py-2 w-fit">
                    <Sparkles className="h-4 w-4" />
                    <span>24/7 AI assistance</span>
                  </div>
                </div>
                <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                  🤖
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for enhanced animations */}
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