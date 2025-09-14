import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, BarChart3, Clock, Brain, Zap, CheckCircle, AlertCircle, BookOpen, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProgressTrackingService, ProgressReport } from '../../services/progressTrackingService';

export function DetailedProgressReport() {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'chapter'>('weekly');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      loadProgressData();
    }
  }, [userProfile, reportType]);

  const loadProgressData = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    setError(null);
    try {
      // Generate new report
      const newReport = await ProgressTrackingService.generateProgressReport(
        userProfile.id,
        reportType
      );
      
      // Get user analytics
      const userAnalytics = await ProgressTrackingService.getUserAnalytics(userProfile.id);
      
      setSelectedReport(newReport);
      setAnalytics(userAnalytics);
    } catch (error) {
      console.error('Error loading progress data:', error);
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pb-20 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Generating Progress Report</h2>
          <p className="text-gray-300">Analyzing your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pb-20 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Report</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => loadProgressData()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  if (!selectedReport || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pb-20 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No Progress Data</h2>
          <p className="text-gray-300">Start solving questions to see your detailed progress report!</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatDate(start);
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 pb-20 relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Detailed Progress Report
              </h1>
              <p className="text-emerald-200 text-lg">
                {formatDateRange(selectedReport.report_period_start, selectedReport.report_period_end)}
              </p>
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
            {(['weekly', 'monthly', 'chapter'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  reportType === type
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Report
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{selectedReport.questions_attempted}</div>
                <div className="text-sm text-gray-300">Questions Attempted</div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{selectedReport.accuracy_percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-300">Accuracy Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.floor(selectedReport.time_spent_minutes / 60)}h {selectedReport.time_spent_minutes % 60}m</div>
                <div className="text-sm text-gray-300">Study Time</div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{selectedReport.concepts_mastered.length}</div>
                <div className="text-sm text-gray-300">Concepts Mastered</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="h-8 w-8 text-emerald-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">AI Learning Insights</h2>
          </div>
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-6 border border-emerald-500/20">
            <p className="text-emerald-100 leading-relaxed text-lg whitespace-pre-line">
              {selectedReport.ai_insights}
            </p>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="h-8 w-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Your Strengths</h3>
            </div>
            {selectedReport.strengths_identified.length > 0 ? (
              <div className="space-y-3">
                {selectedReport.strengths_identified.map((strength, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-100 font-medium">{strength}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Keep practicing to identify your strengths! 💪
              </div>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">Focus Areas</h3>
            </div>
            {selectedReport.areas_for_improvement.length > 0 ? (
              <div className="space-y-3">
                {selectedReport.areas_for_improvement.map((area, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-100 font-medium">{area}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Great! No major areas for improvement identified! 🎉
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Personalized Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedReport.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-blue-100 leading-relaxed">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active AI Recommendations */}
        {analytics.recommendations.length > 0 && (
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">AI-Generated Study Plan</h3>
            </div>
            <div className="space-y-4">
              {analytics.recommendations.slice(0, 5).map((rec: any, index: number) => (
                <div key={rec.id} className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        rec.priority_level >= 4 ? 'bg-red-400' : 
                        rec.priority_level >= 3 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <span className="font-bold text-purple-300 capitalize">{rec.recommendation_type.replace('_', ' ')}</span>
                      {rec.concept && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {rec.concept}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-purple-400">{rec.estimated_time_minutes} min</span>
                  </div>
                  <p className="text-purple-100 leading-relaxed mb-4">{rec.recommendation_text}</p>
                  
                  {rec.study_materials && Object.keys(rec.study_materials).length > 0 && (
                    <div className="bg-purple-800/20 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-300 mb-2">Study Materials:</h4>
                      <div className="text-sm text-purple-200">
                        {Object.entries(rec.study_materials).map(([type, materials]: [string, any]) => (
                          <div key={type} className="mb-2">
                            <span className="font-medium capitalize">{type}:</span> {Array.isArray(materials) ? materials.join(', ') : 'Available'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analytics */}
        {selectedReport.report_data && (
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Detailed Analytics</h3>
            </div>
            
            {/* Concept Performance */}
            {selectedReport.report_data.conceptStats && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Concept Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedReport.report_data.conceptStats).map(([concept, stats]: [string, any]) => (
                    <div key={concept} className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-4 border border-cyan-500/20">
                      <div className="font-semibold text-cyan-300 mb-2">{concept}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200">Accuracy:</span>
                          <span className={`font-bold ${stats.accuracy >= 80 ? 'text-green-400' : stats.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {stats.accuracy.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200">Questions:</span>
                          <span className="text-cyan-100">{stats.correct}/{stats.total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200">Avg Time:</span>
                          <span className="text-cyan-100">{Math.round(stats.avgTime)}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Progression */}
            {selectedReport.report_data.difficultyProgression && (
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Difficulty Progression</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(selectedReport.report_data.difficultyProgression).map(([difficulty, stats]: [string, any]) => (
                    <div key={difficulty} className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-300 capitalize mb-2">{difficulty}</div>
                        <div className="text-3xl font-bold text-white mb-2">{stats.accuracy?.toFixed(1) || 0}%</div>
                        <div className="text-sm text-indigo-200">{stats.correct || 0}/{stats.total || 0} correct</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}