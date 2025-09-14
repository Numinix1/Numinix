import React, { useState } from 'react';
import chaptersData from '../../data/chapters.json';
import { User, Edit3, Coins, Trophy, Target, ArrowLeft, Star, Award, Zap, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import avatarsData from '../../data/avatars.json';
import { DetailedProgressReport } from './DetailedProgressReport';

export function Profile() {
  const [showProgressReport, setShowProgressReport] = useState(false);
  const { userProfile, updateUserProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarPurchase = async (avatarId: number, cost: number) => {
    if (!userProfile || userProfile.total_coins < cost) return;
    
    await updateUserProfile({
      total_coins: userProfile.total_coins - cost,
      avatar_id: avatarId
    });
    setShowAvatarSelector(false);
  };

  const currentAvatar = avatarsData.find(a => a.id === userProfile?.avatar_id);
  const totalQuestions = (userProfile?.total_correct || 0) + (userProfile?.total_wrong || 0);
  const accuracy = totalQuestions > 0 ? Math.round(((userProfile?.total_correct || 0) / totalQuestions) * 100) : 0;

  // Calculate learning progress based on unlocked chapters vs total chapters for class
  const classChapters = chaptersData.filter(ch => ch.class_level === userProfile?.class_level);
  const unlockedCount = userProfile?.unlocked_chapters?.length || 1;
  const learningProgress = Math.min((unlockedCount / classChapters.length) * 100, 100);
  
  // Calculate chapter completion progress
  const completedChapters = Object.values(userProfile?.chapter_stars || {}).filter(stars => stars >= 3).length;
  const chapterProgress = classChapters.length > 0 ? (completedChapters / classChapters.length) * 100 : 0;

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20">
        <div className="text-center">
          <div className="text-3xl mb-4">Profile not found or you are not logged in.</div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (showProgressReport) {
    return (
      <div>
        <button
          onClick={() => setShowProgressReport(false)}
          className="fixed top-4 left-4 z-50 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-full hover:bg-black/60 transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </button>
        <DetailedProgressReport />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
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

      {/* Floating Profile Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['👤', '🏆', '⭐', '💎', '🎯', '📊'].map((symbol, i) => (
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-purple-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-4 border-white/50">
                  {currentAvatar?.image || '🧮'}
                </div>
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-110"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                {/* Avatar Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 animate-pulse -z-10 scale-110"></div>
                {/* Avatar Selector Modal */}
                {showAvatarSelector && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl max-w-lg w-full relative border border-white/20">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                        onClick={() => setShowAvatarSelector(false)}
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Choose Your Avatar</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {avatarsData.map((avatar) => {
                          const isUnlocked = avatar.unlocked || (userProfile?.total_coins ?? 0) >= avatar.cost;
                          const canAfford = (userProfile?.total_coins ?? 0) >= avatar.cost;
                          return (
                            <div
                              key={avatar.id}
                              onClick={async () => {
                                if (avatar.cost === 0) {
                                  await updateUserProfile({ avatar_id: avatar.id });
                                  // Wait for context to update before closing modal
                                  const waitForUpdate = async () => {
                                    for (let i = 0; i < 10; i++) {
                                      await new Promise(res => setTimeout(res, 100));
                                      if (userProfile?.avatar_id === avatar.id) break;
                                    }
                                  };
                                  await waitForUpdate();
                                  setShowAvatarSelector(false);
                                } else if (canAfford) {
                                  await handleAvatarPurchase(avatar.id, avatar.cost);
                                  // Wait for context to update before closing modal
                                  const waitForUpdate = async () => {
                                    for (let i = 0; i < 10; i++) {
                                      await new Promise(res => setTimeout(res, 100));
                                      if (userProfile?.avatar_id === avatar.id) break;
                                    }
                                  };
                                  await waitForUpdate();
                                  setShowAvatarSelector(false);
                                }
                              }}
                              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 ${
                                userProfile?.avatar_id === avatar.id
                                  ? 'border-blue-500 bg-blue-900/40 shadow-lg backdrop-blur-sm'
                                  : isUnlocked
                                  ? 'border-white/20 hover:border-blue-300 hover:bg-blue-900/20 backdrop-blur-sm'
                                  : 'border-white/10 bg-gray-900/20 opacity-60 backdrop-blur-sm'
                              }`}
                            >
                              <div className="text-3xl sm:text-4xl text-center mb-2">{avatar.image}</div>
                              <div className="text-xs text-center font-medium text-white mb-1">{avatar.name}</div>
                              {avatar.cost > 0 && (
                                <div className="text-xs text-center text-yellow-400 flex items-center justify-center space-x-1">
                                  <Coins className="h-3 w-3" />
                                  <span>{avatar.cost}</span>
                                </div>
                              )}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-gray-900/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                  <div className="text-white text-xs font-bold bg-gray-900/80 px-2 py-1 rounded-lg">
                                    Locked
                                  </div>
                                </div>
                              )}
                              {userProfile?.avatar_id === avatar.id && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{userProfile?.name || userProfile?.full_name || 'Student'}</h1>
                <p className="text-gray-300 mb-4 text-lg">Class {userProfile?.class_level} Student • {currentAvatar?.name}</p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border border-yellow-200/50 shadow-sm">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span className="text-lg font-bold text-yellow-700">{userProfile?.total_coins || userProfile?.money || 0}</span>
                    <span className="text-xs text-yellow-600">coins</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-2 rounded-full border border-emerald-200/50 shadow-sm">
                    <Trophy className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-emerald-700">{userProfile?.total_correct}</span>
                    <span className="text-xs text-emerald-600">correct</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200/50 shadow-sm">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-blue-700">{userProfile?.unlocked_chapters?.length || 1}</span>
                    <span className="text-xs text-blue-600">chapters</span>
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  className="mt-6 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  onClick={async () => {
                    await signOut();
                    navigate('/auth');
                  }}
                >
                  Logout
                </button>
                
                <button
                  onClick={() => setShowProgressReport(true)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>View Detailed Progress Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Learning Progress</span>
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-300">Accuracy Rate</span>
                  <span className="font-bold text-emerald-600">{accuracy}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-300">Learning Progress</span>
                  <span className="font-bold text-blue-600">{Math.round(learningProgress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${learningProgress}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-300">Chapter Completion</span>
                  <span className="font-bold text-purple-600">{completedChapters}/{classChapters.length} chapters</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${chapterProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Achievements</span>
            </h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl transition-all duration-300 ${userProfile && userProfile.money >= 100 ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 shadow-sm' : 'bg-white/5 border border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">Coin Collector</span>
                  <span className="text-sm text-gray-300">100 coins</span>
                </div>
                {userProfile && userProfile.money >= 100 && (
                  <div className="text-xs text-yellow-400 mt-2 flex items-center space-x-1">
                    <Trophy className="h-3 w-3" />
                    <span>Achieved!</span>
                  </div>
                )}
              </div>
              
              <div className={`p-4 rounded-xl transition-all duration-300 ${userProfile && userProfile.total_correct >= 50 ? 'bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/30 shadow-sm' : 'bg-white/5 border border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">Problem Solver</span>
                  <span className="text-sm text-gray-300">50 correct</span>
                </div>
                {userProfile && userProfile.total_correct >= 50 && (
                  <div className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
                    <Trophy className="h-3 w-3" />
                    <span>Achieved!</span>
                  </div>
                )}
              </div>
              
              <div className={`p-4 rounded-xl transition-all duration-300 ${userProfile && Array.isArray(userProfile.unlocked_chapters) && userProfile.unlocked_chapters.length >= 3 ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-sm' : 'bg-white/5 border border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">Chapter Master</span>
                  <span className="text-sm text-gray-300">3 chapters</span>
                </div>
                {userProfile && Array.isArray(userProfile.unlocked_chapters) && userProfile.unlocked_chapters.length >= 3 && (
                  <div className="text-xs text-blue-400 mt-2 flex items-center space-x-1">
                    <Trophy className="h-3 w-3" />
                    <span>Achieved!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Selector Modal */}
        {showAvatarSelector && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/40 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Choose Your Avatar</h2>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-gray-400 hover:text-white text-2xl transition-colors hover:scale-110 transform"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {avatarsData.map((avatar) => {
                  const currentCoins = userProfile?.total_coins || userProfile?.money || 0;
                  const canAfford = currentCoins >= avatar.cost;
                  const isUnlocked = avatar.cost === 0 || canAfford;
                  
                  return (
                    <div
                      key={avatar.id}
                              onClick={async () => {
                                if (avatarLoading) return;
                                if (avatar.cost === 0) {
                                  setAvatarLoading(true);
                                  await updateUserProfile({ avatar_id: avatar.id });
                                  // Wait for context to update
                                  setAvatarLoading(false);
                                  setShowAvatarSelector(false);
                                } else if (canAfford) {
                                  setAvatarLoading(true);
                                  await handleAvatarPurchase(avatar.id, avatar.cost);
                                  setAvatarLoading(false);
                                }
                              }}
                              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 ${
                                userProfile?.avatar_id === avatar.id
                                  ? 'border-blue-500 bg-blue-900/40 shadow-lg backdrop-blur-sm'
                                  : isUnlocked
                                  ? 'border-white/20 hover:border-blue-300 hover:bg-blue-900/20 backdrop-blur-sm'
                                  : 'border-white/10 bg-gray-900/20 opacity-60 backdrop-blur-sm'
                              }`}
                    >
                              <div className="text-3xl sm:text-4xl text-center mb-2">{avatar.image}</div>
                              <div className="text-xs text-center font-medium text-white mb-1">{avatar.name}</div>
                              {avatar.cost > 0 && (
                                <div className="text-xs text-center text-yellow-400 flex items-center justify-center space-x-1">
                                  <Coins className="h-3 w-3" />
                                  <span>{avatar.cost}</span>
                                </div>
                              )}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-gray-900/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                  <div className="text-white text-xs font-bold bg-gray-900/80 px-2 py-1 rounded-lg">
                                    Locked
                                  </div>
                                </div>
                              )}
                              {userProfile?.avatar_id === avatar.id && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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