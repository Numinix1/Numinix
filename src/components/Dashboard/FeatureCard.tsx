import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  path: string;
}

export function FeatureCard({ title, description, icon: Icon, gradient, path }: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-3"
    >
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-white/40 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
        
        {/* Magical floating elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse group-hover:animate-bounce transition-all duration-300"></div>
        <div className="absolute bottom-6 right-6 w-2 h-2 bg-purple-400/40 rounded-full animate-ping group-hover:animate-pulse"></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-yellow-400/50 rounded-full animate-pulse group-hover:animate-bounce"></div>
        
        <div className="relative z-10">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl relative overflow-hidden`}>
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2">
            <span>{title}</span>
            <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </h3>
          
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6 group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
              <span>Explore now</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
              <span className="text-blue-400 text-lg font-bold group-hover:text-purple-400 transition-colors">→</span>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
}