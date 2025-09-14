import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calculator, Trophy, Gamepad2, Map, Timer, Target, User, Sparkles } from 'lucide-react';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/', gradient: 'from-blue-500 to-indigo-600' },
    { icon: Calculator, label: 'AI Tutor', path: '/ai-tutor', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Trophy, label: 'Quiz', path: '/quiz', gradient: 'from-amber-500 to-orange-600' },
    { icon: Map, label: 'Math Map', path: '/math-map', gradient: 'from-purple-500 to-violet-600' },
    { icon: Timer, label: 'Timer', path: '/timer', gradient: 'from-rose-500 to-pink-600', hideOnMobile: true },
    { icon: Gamepad2, label: 'Games', path: '/games', gradient: 'from-cyan-500 to-blue-500', hideOnMobile: true },
    { icon: Target, label: 'Tools', path: '/tools', gradient: 'from-indigo-500 to-purple-600', hideOnMobile: true },
    { icon: User, label: 'Profile', path: '/profile', gradient: 'from-gray-600 to-slate-700' }
  ];

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleItems = isMobile 
    ? navItems.filter(item => !item.hideOnMobile)
    : navItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 safe-area-pb">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-3">
          <div className="flex justify-between items-center">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() => navigate(item.path)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-500 transform ${
                      isActive 
                        ? 'scale-110 -translate-y-2' 
                        : 'hover:scale-125 hover:-translate-y-3 hover:rotate-3'
                    }`}
                  >
                    {/* Background glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl scale-150`}></div>
                    
                    {/* Icon container */}
                    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl`
                        : 'text-gray-400 group-hover:text-white group-hover:bg-gradient-to-r group-hover:' + item.gradient.replace('from-', 'from-').replace('to-', 'to-') + ' group-hover:shadow-xl'
                    }`}>
                      <item.icon className="h-6 w-6 relative z-10" />
                      
                      {/* Sparkle effect for active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl">
                          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>

                    {/* Active indicator removed as per user request */}
                  </button>

                  {/* Hover label */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-xl text-white px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border border-white/20 shadow-2xl">
                      {item.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}