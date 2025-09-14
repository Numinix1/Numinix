import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Sparkles, Crown, Zap } from 'lucide-react';

export function Timer() {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sandLevel, setSandLevel] = useState(100); // Percentage of sand in top chamber
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSandLevel(0);
            return 0;
          }
          const newTimeLeft = prev - 1;
          setSandLevel((newTimeLeft / duration) * 100);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setSandLevel(100);
  };

  // Update sand level when duration changes
  useEffect(() => {
    setSandLevel((timeLeft / duration) * 100);
  }, [duration, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-pink-900 pb-20 relative overflow-hidden">
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

      {/* Floating Time Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⏰', '⏳', '⌛', '🕐', '⏱️', '🔔'].map((symbol, i) => (
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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Focus Timer
              </h1>
              <p className="text-pink-200 text-lg">Premium study sessions with realistic sand timer</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Realistic Sand Timer */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Premium Hourglass Container */}
              <div className="w-64 h-96 sm:w-80 sm:h-[28rem] relative">
                {/* Hourglass Frame with Ultra-Premium Glass Effect */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Top Half */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 border-4 border-amber-600/80 rounded-t-full bg-gradient-to-b from-amber-50/10 to-transparent overflow-hidden backdrop-blur-sm shadow-2xl">
                      {/* Top Sand with Ultra-Realistic Flow */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-linear rounded-b-full overflow-hidden"
                        style={{ height: `${Math.max(8, sandLevel)}%` }}
                      >
                        {/* Main Sand Body with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500 via-yellow-400 to-yellow-300 shadow-inner">
                          {/* Realistic Sand Particles */}
                          {[...Array(50)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-0.5 bg-yellow-600 rounded-full animate-pulse"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random()}s`
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Sand Surface with Realistic Texture */}
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent animate-pulse"></div>
                        
                        {/* Sand Slope Effect */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full opacity-80"></div>
                      </div>
                      
                      {/* Enhanced Falling Sand Stream */}
                      {isRunning && timeLeft > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="w-1.5 h-12 bg-gradient-to-b from-yellow-300 to-amber-500 animate-pulse shadow-lg"></div>
                          {/* Ultra-Realistic Falling Particles */}
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-1 bg-yellow-400 rounded-full animate-bounce"
                              style={{
                                left: `${-3 + Math.random() * 6}px`,
                                top: `${i * 8}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.6s'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Middle Neck */}
                  <div className="h-12 flex justify-center items-center relative">
                    <div className="w-10 h-12 bg-gradient-to-b from-amber-700 to-amber-800 relative overflow-hidden shadow-inner rounded-sm">
                      {/* Neck Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"></div>
                      
                      {/* Enhanced Falling Sand Stream in Neck */}
                      {isRunning && timeLeft > 0 && (
                        <div className="absolute inset-0 flex justify-center">
                          <div className="w-2 h-full bg-gradient-to-b from-yellow-400 to-amber-500 animate-pulse shadow-lg">
                            {/* Stream particles with realistic physics */}
                            <div className="absolute inset-0 overflow-hidden">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-0.5 h-2 bg-yellow-300 rounded-full animate-bounce"
                                  style={{
                                    left: '50%',
                                    top: `${i * 20}%`,
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: '0.5s'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Half */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 border-4 border-amber-600/80 rounded-b-full bg-gradient-to-t from-amber-50/10 to-transparent overflow-hidden backdrop-blur-sm shadow-2xl">
                      {/* Bottom Sand with Realistic Accumulation */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-linear rounded-t-full overflow-hidden"
                        style={{ height: `${Math.max(8, 100 - sandLevel)}%` }}
                      >
                        {/* Main Sand Body with Depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 shadow-inner">
                          {/* Accumulated Sand Particles */}
                          {[...Array(Math.floor((100 - sandLevel) / 3))].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-0.5 bg-amber-600 rounded-full animate-pulse"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                bottom: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Realistic Sand Accumulation Point */}
                        {isRunning && timeLeft > 0 && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-yellow-400 to-transparent rounded-full animate-pulse"></div>
                        )}
                        
                        {/* Surface Shimmer Effect */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-200/80 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Hourglass Stand */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-r from-amber-800 to-amber-900 rounded-full shadow-2xl border border-amber-600/50"></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-r from-amber-800 to-amber-900 rounded-full shadow-2xl border border-amber-600/50"></div>

                {/* Ultra-Premium Magical Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 via-transparent to-amber-400/30 animate-pulse pointer-events-none blur-xl"></div>
                
                {/* Distance indicator when time is over */}
                {timeLeft === 0 && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
                      <div className="text-lg font-bold">⏰ Time's Up!</div>
                      <div className="text-sm opacity-90">All sand has fallen</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Timer Display */}
              <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border border-rose-500/30 shadow-2xl">
                  <div className="text-6xl sm:text-8xl font-mono font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-3 drop-shadow-lg">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-rose-300 font-medium text-lg">
                    {timeLeft === 0 ? '✨ Session Complete! ✨' : isRunning ? '🔥 Focus Mode Active' : '⏳ Ready to Focus?'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="space-y-8">
            <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                <div className="w-4 h-4 bg-rose-400 rounded-full animate-pulse"></div>
                <span>Timer Controls</span>
                <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
              </h2>
              
              <div className="space-y-8">
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={toggleTimer}
                    className={`group relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isRunning 
                        ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:to-pink-700' 
                        : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {isRunning ? <Pause className="h-10 w-10 relative z-10" /> : <Play className="h-10 w-10 ml-1 relative z-10" />}
                    <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
                  </button>
                  
                  <button
                    onClick={resetTimer}
                    className="group relative w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:to-gray-800 flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <RotateCcw className="h-10 w-10 relative z-10" />
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="group relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Settings className="h-10 w-10 relative z-10" />
                  </button>
                </div>

                {showSettings && (
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/10 animate-in slide-in-from-top duration-300">
                    <h3 className="font-semibold text-white text-lg flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-rose-400" />
                      <span>Timer Presets</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: '15 min', value: 15 * 60, color: 'from-green-500 to-emerald-600' },
                        { label: '25 min', value: 25 * 60, color: 'from-blue-500 to-indigo-600' },
                        { label: '45 min', value: 45 * 60, color: 'from-purple-500 to-violet-600' },
                        { label: '60 min', value: 60 * 60, color: 'from-orange-500 to-red-600' },
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => {
                            setDuration(preset.value);
                            setTimeLeft(preset.value);
                            setIsRunning(false);
                          }}
                          className={`px-6 py-4 bg-gradient-to-r ${preset.color} rounded-xl hover:scale-105 transition-all duration-200 text-white font-semibold shadow-lg border border-white/20`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Time Input */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        placeholder="Custom (min)"
                        className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm focus:border-rose-400 focus:ring focus:ring-rose-100/20 text-white placeholder-gray-400"
                        onChange={e => {
                          const min = Math.max(1, Math.min(180, Number(e.target.value)));
                          setDuration(min * 60);
                          setTimeLeft(min * 60);
                          setIsRunning(false);
                        }}
                      />
                      <span className="text-gray-300 font-medium">minutes</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                      <span>Session Progress</span>
                    </span>
                    <span className="font-bold text-rose-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative w-full bg-black/30 rounded-full h-6 overflow-hidden shadow-inner border border-white/10">
                    <div
                      className="bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 h-6 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Sand particles in progress bar */}
                      {isRunning && [...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                          style={{
                            left: `${10 + i * 20}%`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Study Tips */}
                <div className="bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-2xl p-6 border border-rose-500/20 backdrop-blur-sm">
                  <h4 className="font-semibold text-rose-300 mb-4 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-rose-400" />
                    <span>Focus Enhancement Tips</span>
                  </h4>
                  <ul className="text-sm text-rose-200 space-y-3">
                    {[
                      "🧘 Take 3 deep breaths before starting",
                      "📱 Put devices in airplane mode",
                      "🎯 Focus on one problem at a time",
                      "🏆 Celebrate small victories"
                    ].map((tip, index) => (
                      <li key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-rose-800/20 transition-colors">
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer completion celebration */}
        {timeLeft === 0 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-90 animate-bounce shadow-2xl flex items-center justify-center mb-6">
                <Sparkles className="h-24 w-24 text-white animate-spin" />
              </div>
              <div className="text-5xl font-bold text-white drop-shadow-lg animate-pulse mb-4">
                🎉 Excellent Focus! 🎉
              </div>
              <div className="text-2xl text-rose-300">
                You've completed your study session!
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