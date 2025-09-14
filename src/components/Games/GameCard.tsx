import { Sparkles, Play, Crown } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  component: string;
  onPlay?: () => void;
}

const colorClasses = {
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-red-600',
};

export function GameCard({ title, description, icon: Icon, color, component, onPlay }: GameCardProps) {
  const handleClick = () => {
    if (typeof onPlay === 'function') {
      onPlay();
    } else {
      alert(`${title} is coming soon! We're working hard to bring you the best gaming experience.`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
    >
      <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 hover:border-white/40 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
        
        {/* Magical floating elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse group-hover:animate-bounce transition-all duration-300"></div>
        <div className="absolute bottom-6 right-6 w-2 h-2 bg-purple-400/40 rounded-full animate-ping group-hover:animate-pulse"></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-yellow-400/50 rounded-full animate-pulse group-hover:animate-bounce"></div>
        
        <div className="relative z-10">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl relative overflow-hidden`}>
            <Icon className="h-10 w-10 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Crown for premium games */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Crown className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2">
            <span>{title}</span>
            <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </h3>
          
          <p className="text-gray-300 leading-relaxed text-lg mb-6 group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
              <Play className="h-4 w-4 text-blue-400 group-hover:text-purple-400 transition-colors" />
              <span>Play Now</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <span className="text-blue-400 text-xl font-bold group-hover:text-purple-400 transition-colors">→</span>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
}