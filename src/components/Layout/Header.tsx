import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Coins, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import avatarsData from '../../data/avatars.json';

export function Header() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Numinix
              </span>
              <div className="text-xs text-gray-500 -mt-1">Learn • Play • Grow</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {user && userProfile && (
              <>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200/50 shadow-sm">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-700">{userProfile.total_coins || userProfile.money || 0}</span>
                  <span className="text-xs text-yellow-600 hidden sm:inline">coins</span>
                </div>
                
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 bg-gray-50/80 hover:bg-gray-100/80 px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm shadow-sm">
                    {avatarsData.find(a => a.id === userProfile.avatar_id)?.image || '🧮'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{userProfile.name || userProfile.full_name || 'Student'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}