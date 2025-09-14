import React from 'react';
import { Home, Calculator, Gamepad2, Map, Trophy, Target, TrendingUp, Timer, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', gradient: 'from-blue-500 to-blue-600' },
    { icon: Calculator, label: 'AI Tutor', path: '/ai-tutor', gradient: 'from-green-500 to-green-600' },
    { icon: Trophy, label: 'Quiz Arena', path: '/quiz', gradient: 'from-yellow-500 to-orange-500' },
    { icon: Gamepad2, label: 'Games', path: '/games', gradient: 'from-purple-500 to-pink-500' },
    { icon: Map, label: 'Math Map', path: '/math-map', gradient: 'from-indigo-500 to-purple-600' },
    { icon: Timer, label: 'Focus Timer', path: '/timer', gradient: 'from-red-500 to-pink-500' },
    { icon: Target, label: 'Tools', path: '/tools', gradient: 'from-teal-500 to-cyan-500' },
    { icon: TrendingUp, label: 'Progress', path: '/progress', gradient: 'from-emerald-500 to-green-600' },
    { icon: User, label: 'Profile', path: '/profile', gradient: 'from-gray-500 to-gray-600' },
  ];

  return (
    <aside className="w-72 bg-white/90 backdrop-blur-md border-r border-gray-100 h-screen overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                location.pathname === item.path
                  ? 'bg-white/20'
                  : 'bg-gradient-to-r ' + item.gradient + ' text-white group-hover:scale-110'
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}