import React, { useState, useEffect } from 'react';
import { Brain, Clock, Target, BookOpen, Sparkles, Trophy, Zap, Crown, ArrowRight, CheckCircle, Star, TrendingUp, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProgressTrackingService } from '../../services/progressTrackingService';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

interface PersonalizedRoadmapModalProps {
  chapterId: string;
  chapterName: string;
  onClose: () => void;
  setShowNavigation: (show: boolean) => void;
}

interface PersonalizedRoadmap {
  id?: string;
  user_id: string;
  chapter_id: string;
  roadmap_data: any;
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  focus_areas: string[];
  priority_concepts: string[];
  last_updated: string;
}

interface PersonalizedContent {
  id?: string;
  user_id: string;
  chapter_id: string;
  topic: string;
  content_type: 'explanation' | 'example' | 'practice' | 'summary';
  personalized_content: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  user_weaknesses: string[];
  user_strengths: string[];
  last_updated: string;
  effectiveness_score: number;
  usage_count: number;
}

export function PersonalizedRoadmapModal({ chapterId, chapterName, onClose, setShowNavigation }: PersonalizedRoadmapModalProps) {
  const { userProfile } = useAuth();
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<{ [topic: string]: PersonalizedContent }>({});
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'content' | 'insights'>('roadmap');
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      loadPersonalizedData();
    }
  }, [userProfile, chapterId]);

  const loadPersonalizedData = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      // Load personalized roadmap
      const roadmapData = await ProgressTrackingService.getPersonalizedRoadmap(userProfile.id, chapterId);
      setRoadmap(roadmapData);

      // Load AI insights
      const insights = await ProgressTrackingService.getLatestAIInsights(userProfile.id);
      setAiInsights(insights);

      // Load personalized content for chapter topics
      const sampleTopics = ['Introduction', 'Core Concepts', 'Applications'];
      const contentData: { [topic: string]: PersonalizedContent } = {};

      // Only Introduction and Applications
      const topics = ['Introduction', 'Applications'];
      for (const topic of topics) {
        const performance = {
          classLevel: userProfile.class_level,
          testScore: roadmapData?.diagnostic?.score_percentage || 0,
          strengths: roadmapData?.strongAreas || [],
          weaknesses: roadmapData?.weakAreas || [],
          fullName: userProfile.name || userProfile.full_name || 'Student'
        };
        // For Applications, ask AI specifically for real-world uses
        const aiTopic = topic === 'Applications'
          ? `What are the real-world applications of the chapter '${chapterName}'? Explain in detail for ${performance.fullName}.`
          : topic;
        const content = await ProgressTrackingService.getPersonalizedContent(
          userProfile.id,
          chapterId,
          aiTopic,
          performance
        );
        if (content) {
          contentData[topic] = content;
        }
      }
      setPersonalizedContent(contentData);

    } catch (error) {
      console.error('Error loading personalized data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      await ProgressTrackingService.regenerateAIInsights(userProfile.id);
      const newInsights = await ProgressTrackingService.getLatestAIInsights(userProfile.id);
      setAiInsights(newInsights);
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg mx-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading Your Personalized Journey</h2>
          <p className="text-gray-300">Creating your custom learning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
  <div className="bg-black/40 backdrop-blur-2xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="p-8 border-b border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{chapterName}</h2>
                <p className="text-gray-300">Your Personalized Learning Journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl transition-colors hover:scale-110 transform"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2">
            {[
              { id: 'roadmap', label: 'Learning Roadmap', icon: Target },
              { id: 'content', label: 'Study Content', icon: BookOpen },
              { id: 'insights', label: 'AI Insights', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'roadmap' && (
            <div className="space-y-8">
              {roadmap ? (
                <>
                  {/* Roadmap Header */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/20">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center space-x-2">
                      <Crown className="h-6 w-6 text-yellow-400" />
                      <span>{roadmap.roadmap_data.roadmap_title}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{roadmap.roadmap_data.student_level}</div>
                        <div className="text-sm text-blue-200">Your Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{roadmap.current_step}/{roadmap.total_steps}</div>
                        <div className="text-sm text-green-200">Steps Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{Math.round(roadmap.completion_percentage)}%</div>
                        <div className="text-sm text-purple-200">Progress</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${roadmap.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Learning Steps */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                      <Target className="h-6 w-6 text-green-400" />
                      <span>Your Learning Path</span>
                    </h4>
                    
                    {roadmap.roadmap_data.steps?.map((step: any, index: number) => (
                      <div
                        key={step.step_number}
                        className={`bg-gradient-to-r rounded-2xl p-6 border transition-all duration-300 ${
                          index < roadmap.current_step
                            ? 'from-green-900/30 to-emerald-900/30 border-green-500/20'
                            : index === roadmap.current_step
                            ? 'from-blue-900/30 to-indigo-900/30 border-blue-500/20 ring-2 ring-blue-400/30'
                            : 'from-gray-900/30 to-slate-900/30 border-gray-500/20'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index < roadmap.current_step
                              ? 'bg-green-500 text-white'
                              : index === roadmap.current_step
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {index < roadmap.current_step ? <CheckCircle className="h-6 w-6" /> : step.step_number}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-xl font-bold text-white">{step.title}</h5>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-300 text-sm">{step.estimated_time_minutes} min</span>
                              </div>
                            </div>
                            {/* AI-generated content based on user data, markdown formatted */}
                            <div className="prose prose-invert max-w-none text-gray-100 mb-4">
                              <ReactMarkdown>{step.ai_content}</ReactMarkdown>
                            </div>
                            <div>
                              <h6 className="font-semibold text-blue-200 mb-2">Concepts to Master:</h6>
                              <ul className="space-y-1">
                                {step.concepts?.map((concept: string, conceptIndex: number) => (
                                  <li key={conceptIndex} className="text-blue-100 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>{concept}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3 mt-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Trophy className="h-4 w-4 text-yellow-400" />
                                <span className="font-semibold text-yellow-300">Success Criteria:</span>
                              </div>
                              <p className="text-yellow-100 text-sm">{step.success_criteria}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Study Tips */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-2xl p-6 border border-purple-500/20">
                    <h4 className="text-xl font-bold text-purple-300 mb-4 flex items-center space-x-2">
                      <Sparkles className="h-6 w-6" />
                      <span>Personalized Study Tips</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roadmap.roadmap_data.study_tips?.map((tip: string, index: number) => (
                        <div key={index} className="bg-purple-800/20 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-purple-100">{tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Motivation Message */}
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/20 text-center">
                    <h4 className="text-xl font-bold text-yellow-300 mb-3 flex items-center justify-center space-x-2">
                      <Star className="h-6 w-6" />
                      <span>Your AI Mentor Says</span>
                    </h4>
                    <p className="text-yellow-100 text-lg italic leading-relaxed">
                      {roadmap.roadmap_data.motivation_message}
                    </p>
                    <div className="mt-4 p-4 bg-yellow-800/20 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold text-yellow-300">Next Milestone:</span>
                      </div>
                      <p className="text-yellow-200">{roadmap.roadmap_data.next_milestone}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No Roadmap Available</h3>
                  <p className="text-gray-300 mb-6">Take the chapter diagnostic test to generate your personalized learning roadmap!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span>Personalized Study Content</span>
              </h3>
              
              {Object.keys(personalizedContent).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(personalizedContent).map(([topic, content]) => (
                    <div key={topic} className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-2xl p-6 border border-indigo-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-indigo-300">{topic}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            content.difficulty_level === 'advanced' ? 'bg-red-500/20 text-red-300' :
                            content.difficulty_level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {content.difficulty_level}
                          </span>
                          <span className="text-gray-400 text-xs">
                            Updated: {new Date(content.last_updated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {/* Render explanation and applications using ReactMarkdown for proper formatting */}
                      <div className="prose prose-invert max-w-none text-indigo-100 leading-relaxed">
                        <ReactMarkdown>{content.personalized_content}</ReactMarkdown>
                      </div>
                      {content.user_weaknesses.length > 0 && (
                        <div className="mt-4 p-4 bg-indigo-800/20 rounded-lg">
                          <h5 className="font-semibold text-indigo-300 mb-2">Addressing Your Challenges:</h5>
                          <div className="flex flex-wrap gap-2">
                            {content.user_weaknesses.map((weakness, index) => (
                              <span key={index} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                                {weakness}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No Personalized Content Yet</h3>
                  <p className="text-gray-300">Start solving questions to generate personalized study content!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span>AI Performance Insights</span>
                </h3>
                <button
                  onClick={refreshInsights}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Refresh Insights</span>
                </button>
              </div>
              
              {aiInsights.length > 0 ? (
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-500/20">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="space-y-8">
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                            <BookOpen className="h-6 w-6 text-blue-400" />
                            <span>Personalized Study Content</span>
                          </h3>
                          {/* AI Insights content here if needed */}
                        </div>
                        <Play className="h-5 w-5 text-blue-400" />
                        <span className="text-blue-100">Review mistakes and understand why they happened</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-800/20 rounded-lg">
                        <Play className="h-5 w-5 text-blue-400" />
                        <span className="text-blue-100">Use the AI tutor when you're stuck on problems</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No AI Insights Yet</h3>
                  <p className="text-gray-300 mb-6">Solve more questions to get personalized AI insights about your learning!</p>
                  <button
                    onClick={refreshInsights}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Generate Insights
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/20">
          <div className="flex space-x-4">
            {activeTab !== 'content' && (
              <button
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-lg flex items-center justify-center space-x-2"
                onClick={() => setActiveTab('content')}
              >
                <Play className="h-5 w-5" />
                <span>Start Learning</span>
              </button>
            )}
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg flex items-center justify-center space-x-2"
              onClick={() => {
                setShowNavigation(true);
                navigate('/quiz');
              }}
            >
              <Trophy className="h-5 w-5" />
              <span>Take Practice Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}