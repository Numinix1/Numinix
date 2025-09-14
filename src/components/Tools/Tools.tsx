import React, { useState } from 'react';
import { Calculator, Ruler, Clock, ArrowLeftRight, ChevronLeft } from 'lucide-react';
import { ScientificCalculator } from './ScientificCalculator';
import { UnitConverter } from './UnitConverter';
import { MeasurementTools } from './MeasurementTools';
import { TimeCalculator } from './TimeCalculator';
import { ToolCard } from './ToolCard';

export function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'calculator',
      title: 'Scientific Calculator',
      description: 'Advanced calculator with scientific functions',
      icon: Calculator,
      color: 'blue',
    },
    {
      id: 'converter',
      title: 'Unit Converter',
      description: 'Convert between different units of measurement',
      icon: ArrowLeftRight,
      color: 'green',
    },
    {
      id: 'measurement',
      title: 'Measurement Tools',
      description: 'Interactive rulers and measurement utilities',
      icon: Ruler,
      color: 'purple',
    },
    {
      id: 'time',
      title: 'Time Calculator',
      description: 'Calculate time differences and durations',
      icon: Clock,
      color: 'orange',
    },
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'calculator':
        return <ScientificCalculator onBack={() => setActiveTool(null)} />;
      case 'converter':
        return <UnitConverter onBack={() => setActiveTool(null)} />;
      case 'measurement':
        return <MeasurementTools onBack={() => setActiveTool(null)} />;
      case 'time':
        return <TimeCalculator onBack={() => setActiveTool(null)} />;
      default:
        return null;
    }
  };

  if (activeTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
        {renderActiveTool()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
                Math Tools
              </h1>
              <p className="text-purple-200 text-lg">Powerful calculators and utilities for every need</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}