import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import chaptersData from '../data/chapters.json';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserStats: (correct: number, wrong: number, money: number) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Session initialization error:', error);
      if (error.message && error.message.includes('Refresh Token Not Found')) {
        signOut();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile missing, create it with default values
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Get first chapter for default class level
          const firstChapter = chaptersData.find(c => 
            c.class_level === 1 && c.order === 1
          );
          
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: userData.user.id,
              email: userData.user.email || '',
              name: userData.user.user_metadata?.name || '',
              class_level: 1,
              total_coins: 100, // Starting coins
              total_correct: 0,
              total_wrong: 0,
              avatar_id: 1,
              unlocked_chapters: firstChapter ? [firstChapter.id] : ['class9_ch1'],
              diagnostic_completed: false,
            });
          if (insertError) throw insertError;
          // Try fetching again
          return await fetchUserProfile(userId);
        }
      } else if (error) {
        throw error;
      } else {
        // Ensure data consistency - fix any missing fields
        const updatedData = {
          ...data,
          total_coins: data.total_coins ?? data.money ?? 100,
          unlocked_chapters: data.unlocked_chapters || ['class9_ch1'],
          name: data.name || data.full_name || 'Student'
        };
        
        // Update database if any fields were missing
        if (data.total_coins === null || data.total_coins === undefined) {
          await supabase
            .from('user_profiles')
            .update({ total_coins: updatedData.total_coins })
            .eq('id', userId);
        }
        
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          class_level: userData.class_level
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Get first chapter for the user's class
      const firstChapter = chaptersData.find(c => 
        c.class_level === userData.class_level && c.order === 1
      );

      const { error: userError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email,
          name: userData.name || '',
          class_level: userData.class_level || 1,
          total_coins: 0,
          total_correct: 0,
          total_wrong: 0,
          avatar_id: 1,
          unlocked_chapters: firstChapter ? [firstChapter.id] : [],
          diagnostic_completed: false,
          phone: userData.phone || null,
          full_name: userData.name || '',
          avatar_url: null,
          money: 100
        });

      if (userError) throw userError;
      
      // Fetch the created profile to ensure state is updated
      await fetchUserProfile(data.user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setUser(null);
      setUserProfile(null);
      console.error('Sign out error:', err);
    }
  };

  const updateUserStats = async (correct: number, wrong: number, money: number) => {
    if (!user) return;

    const newTotalCorrect = (userProfile?.total_correct || 0) + correct;
    const newTotalWrong = (userProfile?.total_wrong || 0) + wrong;
    const currentCoins = userProfile?.total_coins || userProfile?.money || 0;
    const newTotalCoins = Math.floor(currentCoins + money);

    console.log('[updateUserStats] Updating user:', user.id, 'Total Coins:', newTotalCoins, 'Correct:', newTotalCorrect, 'Wrong:', newTotalWrong);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        total_correct: newTotalCorrect,
        total_wrong: newTotalWrong,
        total_coins: newTotalCoins,
        money: newTotalCoins,
        total_correct_answers: newTotalCorrect
      })
      .eq('id', user.id);

    if (error) {
      console.error('[updateUserStats] Supabase update error:', error);
      throw error;
    }

    setUserProfile((prev) => prev ? { 
      ...prev, 
      total_correct: newTotalCorrect, 
      total_wrong: newTotalWrong, 
      total_coins: newTotalCoins,
      money: newTotalCoins,
      total_correct_answers: newTotalCorrect
    } : prev);

    // Refresh profile to ensure consistency
    setTimeout(() => fetchUserProfile(user.id), 500);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

  await fetchUserProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut,
      updateUserStats,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}