import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

export function ToolCard({ title, description, icon: Icon, color, onClick }: ToolCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-blue-600 font-medium">Open Tool →</div>
      </div>
    </div>
  );
}