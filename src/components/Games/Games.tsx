import React from 'react';
import { Grid3X3, Puzzle, Brain, Target, Crown } from 'lucide-react';
import { GameCard } from './GameCard';

import Sudoku from './Sudoku';
import NumberPuzzle from './NumberPuzzle';
import BrainTeaser from './BrainTeaser';
import TargetNumber from './TargetNumber';

export function Games() {
  const games = [
    {
      title: 'Sudoku Master',
      description: 'Classic number puzzle with premium design',
      icon: Grid3X3,
      color: 'blue',
      component: 'sudoku',
    },
    {
      title: 'Number Quest',
      description: 'Arrange numbers in perfect sequence',
      icon: Puzzle,
      color: 'purple',
      component: 'number-puzzle',
    },
    {
      title: 'Brain Teaser Pro',
      description: 'Advanced logic and reasoning challenges',
      icon: Brain,
      color: 'green',
      component: 'brain-teaser',
    },
    {
      title: 'Target Challenge',
      description: 'Reach the target using mathematical operations',
      icon: Target,
      color: 'orange',
      component: 'target-number',
    },
  ];

  const [showSudoku, setShowSudoku] = React.useState(false);
  const [showNumberPuzzle, setShowNumberPuzzle] = React.useState(false);
  const [showBrainTeaser, setShowBrainTeaser] = React.useState(false);
  const [showTargetNumber, setShowTargetNumber] = React.useState(false);

  // Game stats state


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20 relative overflow-hidden">
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

      {/* Floating Game Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎮', '🧩', '🎯', '🏆', '⭐', '🎲'].map((symbol, i) => (
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
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Math Games Arena
              </h1>
              <p className="text-blue-200 text-lg">Challenge your mind with premium mathematical games</p>
            </div>
          </div>
        </div>

        {/* Enhanced Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {games.map((game) => (
            <GameCard
              key={game.component}
              {...game}
              onPlay={() => {
                if (game.component === 'sudoku') setShowSudoku(true);
                if (game.component === 'number-puzzle') setShowNumberPuzzle(true);
                if (game.component === 'brain-teaser') setShowBrainTeaser(true);
                if (game.component === 'target-number') setShowTargetNumber(true);
              }}
            />
          ))}
        </div>

        {/* ...existing code... */}
      </div>

      {/* Enhanced Game Modals */}
      {showSudoku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative border border-white/20">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors hover:scale-110 transform"
              onClick={() => setShowSudoku(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Sudoku Master
              </h2>
            </div>
            <Sudoku />
          </div>
        </div>
      )}

      {showNumberPuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative border border-white/20">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors hover:scale-110 transform"
              onClick={() => setShowNumberPuzzle(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Number Quest
              </h2>
            </div>
            <NumberPuzzle />
          </div>
        </div>
      )}

      {showBrainTeaser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative border border-white/20">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors hover:scale-110 transform"
              onClick={() => setShowBrainTeaser(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Brain Teaser Pro
              </h2>
            </div>
            <BrainTeaser />
          </div>
        </div>
      )}

      {showTargetNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative border border-white/20">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors hover:scale-110 transform"
              onClick={() => setShowTargetNumber(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Target Challenge
              </h2>
            </div>
            <TargetNumber />
          </div>
        </div>
      )}

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