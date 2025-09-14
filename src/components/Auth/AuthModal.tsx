import React, { useState } from 'react';
import { X, Mail, Phone, ArrowLeft, Key, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'forgot';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(defaultMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    class_level: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setResetSent(true);
      } else if (mode === 'signup') {
        await signUp(formData.email, formData.password, {
          name: formData.name,
          class_level: formData.class_level,
          phone: formData.phone
        });
        setSignupSuccess(true);
      } else {
        await signIn(formData.email, formData.password);
        onClose();
      }
    } catch (err: any) {
      if (mode === 'signup' && err?.message?.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Please sign in or use a different email.');
      } else if (mode === 'signup' && err?.message?.toLowerCase().includes('duplicate key value')) {
        setError('This email is already registered. Please sign in or use a different email.');
      } else if (mode === 'signup' && err?.message?.toLowerCase().includes('user already exists')) {
        setError('This email is already registered. Please sign in or use a different email.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      phone: '',
      password: '',
      name: '',
      class_level: 1,
    });
    setError('');
    setResetSent(false);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  if (signupSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Check your email!</h2>
          <p className="mb-6">
            A confirmation link has been sent to <span className="font-semibold">{formData.email}</span>.<br />
            Please verify your email to activate your account.
          </p>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all"
            onClick={() => { setSignupSuccess(false); onClose(); }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl max-w-md w-full p-8 relative border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            {mode === 'forgot' ? <Key className="h-8 w-8 text-white" /> : <Mail className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Join Numinix' : 'Reset Password'}
          </h2>
          <p className="text-gray-300">
            {mode === 'signin' ? 'Continue your learning adventure' : 
             mode === 'signup' ? 'Start your math learning journey' : 
             'Enter your email to reset your password'}
          </p>
        </div>

        {resetSent ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Send className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Check Your Email!</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We've sent a password reset link to <span className="text-blue-400 font-semibold">{formData.email}</span>. 
              Click the link in your email to reset your password.
            </p>
            <button
              onClick={() => switchMode('signin')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {mode === 'signup' && (
              <div className="flex space-x-2 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
                    authMethod === 'email'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
                    authMethod === 'phone'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Class Level
                    </label>
                    <select
                      value={formData.class_level}
                      onChange={(e) => setFormData({ ...formData, class_level: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-gray-800">
                          Class {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <input
                  type={authMethod === 'email' ? 'email' : 'tel'}
                  required
                  value={authMethod === 'email' ? formData.email : formData.phone}
                  onChange={(e) => 
                    setFormData({ 
                      ...formData, 
                      [authMethod]: e.target.value 
                    })
                  }
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 font-bold text-lg shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  {loading ? 'Processing...' : 
                   mode === 'signin' ? 'Sign In' : 
                   mode === 'signup' ? 'Create Account' : 
                   'Send Reset Link'}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              {mode === 'signin' && (
                <>
                  <button
                    onClick={() => switchMode('forgot')}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div>
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      Don't have an account? <span className="text-blue-400">Sign up</span>
                    </button>
                  </div>
                </>
              )}
              
              {mode === 'signup' && (
                <button
                  onClick={() => switchMode('signin')}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Already have an account? <span className="text-blue-400">Sign in</span>
                </button>
              )}
              
              {mode === 'forgot' && (
                <button
                  onClick={() => switchMode('signin')}
                  className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white text-sm transition-colors mx-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign In</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}