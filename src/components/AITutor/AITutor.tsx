import { useRef, useEffect } from 'react';

import 'katex/dist/katex.min.css';
// Removed duplicate import of lucide-react icons
// Removed duplicate import of React
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Send, Bot, User, Loader, Sparkles, Brain, Zap, Crown } from 'lucide-react';
import { solveMathProblem } from '../../services/aiService';
import { useAITutor, Message } from '../../context/AITutorContext';
import { useAuth } from '../../context/AuthContext';
import avatars from '../../data/avatars.json';

export function AITutor() {
  const { messages, setMessages, input, setInput, loading, setLoading } = useAITutor();
  const { userProfile } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const solution = await solveMathProblem(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Here's the solution to your problem:",
        isUser: false,
        solution,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't solve that problem right now. Please try again.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
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

      {/* Floating Mathematical Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['∑', '∫', 'π', '∞', '√', '∆', 'θ', 'α', 'β', 'γ'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-4xl font-bold animate-float"
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

      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                AI Math Tutor
              </h1>
              <p className="text-blue-200 text-lg">Your personal mathematical genius assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">MathMentor AI</h2>
                <p className="text-emerald-100 text-sm">Ready to solve any mathematical challenge</p>
              </div>
              <div className="ml-auto flex space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/10"
            ref={messagesContainerRef}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-2xl px-6 py-4 rounded-3xl shadow-xl backdrop-blur-sm border ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/30'
                      : 'bg-black/40 text-white border-white/20'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  {message.solution && (
                    <div className="mt-4 p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-emerald-400/30">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                        <span className="font-bold text-emerald-400">AI Solution:</span>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {message.solution.solution}
                        </ReactMarkdown>
                      </div>
                      {message.solution.error && (
                        <div className="mt-3 text-red-400 text-xs bg-red-900/20 p-2 rounded-lg border border-red-400/30">
                          <strong>Debug Info:</strong> {message.solution.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {message.isUser && (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg text-2xl">
                    {(() => {
                      if (userProfile) {
                        const avatar = avatars.find(a => a.id === userProfile.avatar_id);
                        return avatar ? avatar.image : <User className="h-5 w-5 text-white" />;
                      }
                      return <User className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white/20 flex items-center space-x-3">
                  <Loader className="h-5 w-5 animate-spin text-emerald-400" />
                  <span className="text-gray-300">MathMentor is thinking...</span>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* No need for messagesEndRef anymore */}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me any math question... (e.g., 'Solve x² + 5x + 6 = 0')"
                  className="w-full px-6 py-4 bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Zap className="h-5 w-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-xl transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
                <span className="font-semibold">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

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
