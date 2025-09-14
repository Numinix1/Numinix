import { supabase } from '../lib/supabase';

const GROQ_PROXY_URL = 'http://localhost:3001/api/groq-chat';
const MODEL_NAME = 'openai/gpt-oss-20b';

export interface QuestionAttempt {
  id?: string;
  user_id: string;
  question_id: string;
  question_text: string;
  question_type: 'diagnostic' | 'quiz' | 'practice';
  chapter_id?: string;
  topic?: string;
  concept?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
  hints_used: number;
  attempts_count: number;
  confidence_level: number;
  session_id?: string;
}

export interface StudySession {
  id?: string;
  user_id: string;
  session_type: 'study' | 'quiz' | 'diagnostic' | 'practice';
  chapter_id?: string;
  topic?: string;
  started_at: string;
  ended_at?: string;
  duration_minutes: number;
  questions_attempted: number;
  questions_correct: number;
  concepts_covered: string[];
  session_data: any;
}

export interface ChapterDiagnostic {
  id?: string;
  user_id: string;
  chapter_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_minutes: number;
  strengths: string[];
  last_practiced_at?: string;
  time_to_master_minutes: number;
  difficulty_progression: string[];
}

export interface ProgressReport {
  id?: string;
  user_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'chapter';
  report_period_start: string;
  report_period_end: string;
  chapter_id?: string;
  overall_progress: number;
  strengths_identified: string[];
  areas_for_improvement: string[];
  time_spent_minutes: number;
  questions_attempted: number;
  accuracy_percentage: number;
  concepts_mastered: string[];
  ai_insights: string;
  recommendations: string[];
  report_data: any;
}

export class ProgressTrackingService {
  // Track every question attempt and trigger personalization updates
  static async recordQuestionAttempt(attempt: QuestionAttempt): Promise<void> {
    try {
      const { error } = await supabase
        .from('question_attempts')
        .insert(attempt);

      if (error) throw error;

      // Update concept mastery
      if (attempt.concept && attempt.chapter_id) {
        await this.updateConceptMastery(
          attempt.user_id,
          attempt.chapter_id,
          attempt.concept,
          attempt.is_correct,
          attempt.time_taken_seconds
        );
      }

      // Trigger personalization updates
      await this.updatePersonalizationAfterQuestion(attempt);
    } catch (error) {
      console.error('Error recording question attempt:', error);
      throw error;
    }
  }

  // Update personalization after each question
  static async updatePersonalizationAfterQuestion(attempt: QuestionAttempt): Promise<void> {
    try {
      // Update roadmap based on new performance data
      if (attempt.chapter_id) {
        await this.updatePersonalizedRoadmap(attempt.user_id, attempt.chapter_id);
      }

      // Regenerate AI insights
      await this.regenerateAIInsights(attempt.user_id);

      // Update personalized content
      if (attempt.chapter_id && attempt.topic) {
        await this.updatePersonalizedContent(
          attempt.user_id,
          attempt.chapter_id,
          attempt.topic,
          attempt.is_correct,
          attempt.concept || ''
        );
      }
    } catch (error) {
      console.error('Error updating personalization:', error);
    }
  }

  // Generate or update personalized roadmap
  static async updatePersonalizedRoadmap(userId: string, chapterId: string): Promise<void> {
    try {
      // Get user's performance data for this chapter
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId);

      const { data: diagnostic } = await supabase
        .from('chapter_diagnostics')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .single();

      if (!diagnostic) return;

      // Analyze current performance
      const conceptPerformance = this.analyzeConceptPerformance(attempts || []);
      const weakAreas = Object.entries(conceptPerformance)
        .filter(([_, stats]: [string, any]) => stats.accuracy < 70)
        .map(([concept, _]) => concept);

      const strongAreas = Object.entries(conceptPerformance)
        .filter(([_, stats]: [string, any]) => stats.accuracy >= 80)
        .map(([concept, _]) => concept);

      // Generate AI-powered roadmap
      const roadmapData = await this.generateAIRoadmap(userId, chapterId, {
        diagnostic,
        weakAreas,
        strongAreas,
        recentAttempts: attempts?.slice(-10) || []
      });

      // Save or update roadmap
      const { error } = await supabase
        .from('personalized_roadmaps')
        .upsert([
          {
            user_id: userId,
            chapter_id: chapterId,
            roadmap_data: roadmapData,
            focus_areas: weakAreas,
            priority_concepts: roadmapData.priority_concepts || [],
            total_steps: roadmapData.steps?.length || 0,
            last_updated: new Date().toISOString()
          }
        ], { onConflict: 'user_id,chapter_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating personalized roadmap:', error);
    }
  }

  // Generate AI-powered roadmap
  static async generateAIRoadmap(userId: string, chapterId: string, data: any): Promise<any> {
    try {
      const prompt = `You are an expert math tutor creating a personalized learning roadmap for a student.

Student Performance Data:
- Chapter: ${chapterId}
- Diagnostic Score: ${data.diagnostic.score_percentage}%
- Strengths: ${data.strongAreas.join(', ') || 'None identified'}
- Weak Areas: ${data.weakAreas.join(', ') || 'None identified'}
- Knowledge Gaps: ${data.diagnostic.knowledge_gaps?.join(', ') || 'None'}
- Recent Performance: ${data.recentAttempts.length} recent attempts

For each step, provide a realistic, data-driven estimate for "estimated_time_minutes" based on:
- The student's diagnostic score and performance
- The difficulty of the concepts in that step
- Average time students spend on similar concepts (e.g. 10-20 min for easy, 20-40 min for medium, 40-60 min for hard)
- If the student is weak in a concept, increase the time estimate

Create a personalized roadmap as JSON with this exact structure:
{
  "roadmap_title": "Personalized Learning Path for [Chapter]",
  "student_level": "beginner/intermediate/advanced",
  "priority_concepts": ["concept1", "concept2", "concept3"],
  "steps": [
    {
      "step_number": 1,
      "title": "Review Prerequisites",
      "description": "Focus on foundational concepts",
      "concepts": ["basic concept 1", "basic concept 2"],
      "estimated_time_minutes": 30,
      "difficulty": "easy",
      "resources": ["explanation", "practice problems"],
      "success_criteria": "80% accuracy on practice questions"
    }
  ],
  "study_tips": ["tip1", "tip2", "tip3"],
  "motivation_message": "Encouraging message for the student",
  "next_milestone": "What student should achieve next"
}

Requirements:
- 5-8 steps in logical learning order
- Address weak areas first
- Build on strengths
- Include specific, realistic time estimates for each step
- Motivational and encouraging tone
- Return only valid JSON`;

      const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME || 'openai/gpt-oss-20b',
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result?.choices?.[0]?.message?.content) {
          let text = result.choices[0].message.content.trim();
          text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
          try {
            return JSON.parse(text);
          } catch (parseError) {
            console.error('Error parsing roadmap JSON:', parseError);
          }
        }
      } else {
        // Show a clear error message instead of 'Continue to iterate?'
        const errorText = await response.text();
        throw new Error(`GROQ API error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error generating AI roadmap:', error);
    }

    // Fallback roadmap
    return {
      roadmap_title: `Personalized Learning Path`,
      student_level: data.diagnostic.difficulty_level,
      priority_concepts: data.weakAreas.slice(0, 3),
      steps: [
        {
          step_number: 1,
          title: "Review Fundamentals",
          description: "Strengthen your foundation",
          concepts: data.diagnostic.prerequisite_concepts.slice(0, 2),
          estimated_time_minutes: 45,
          difficulty: "easy",
          resources: ["concept review", "basic practice"],
          success_criteria: "Complete understanding of basics"
        },
        {
          step_number: 2,
          title: "Practice Core Concepts",
          description: "Apply your knowledge",
          concepts: data.weakAreas.slice(0, 2),
          estimated_time_minutes: 60,
          difficulty: "medium",
          resources: ["guided practice", "examples"],
          success_criteria: "70% accuracy on practice problems"
        }
      ],
      study_tips: [
        "Practice daily for 15-20 minutes",
        "Focus on understanding, not memorization",
        "Ask questions when stuck"
      ],
      motivation_message: "You're making great progress! Keep up the excellent work! 🌟",
      next_milestone: "Master the core concepts with 80% accuracy"
    };
  }

  // Regenerate AI insights based on latest performance
  static async regenerateAIInsights(userId: string): Promise<void> {
    try {
      // Get recent performance data
      const { data: recentAttempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('attempted_at', { ascending: false })
        .limit(50);

      const { data: mastery } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId);

      // Generate fresh AI insights
      const insights = await this.generateFreshAIInsights(userId, {
        recentAttempts: recentAttempts || [],
        masteryData: mastery || []
      });

      // Save insights
      const { error } = await supabase
        .from('ai_improvements')
        .insert({
          user_id: userId,
          topic: 'Overall Performance',
          user_notes: 'Auto-generated based on recent activity',
          improvements: insights
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error regenerating AI insights:', error);
    }
  }

  // Generate fresh AI insights
  static async generateFreshAIInsights(userId: string, data: any): Promise<string[]> {
    try {
      const conceptStats = this.analyzeConceptPerformance(data.recentAttempts);
      const recentAccuracy = data.recentAttempts.length > 0 
        ? (data.recentAttempts.filter((a: any) => a.is_correct).length / data.recentAttempts.length) * 100 
        : 0;

      const prompt = `You are an AI math tutor analyzing a student's recent performance. Provide personalized insights and improvement suggestions.

Recent Performance:
- Recent Questions: ${data.recentAttempts.length}
- Recent Accuracy: ${recentAccuracy.toFixed(1)}%
- Concept Performance: ${Object.entries(conceptStats).map(([concept, stats]: [string, any]) => 
  `${concept}: ${stats.accuracy.toFixed(1)}%`).join(', ')}
- Mastered Concepts: ${data.masteryData.filter((m: any) => m.mastery_level >= 0.8).length}

Generate 5-7 specific, actionable insights as a JSON array of strings:
- Identify patterns in performance
- Suggest specific improvement strategies
- Highlight recent progress
- Provide encouragement
- Include next steps

Example format:
["Your accuracy in Algebra has improved by 15% this week! 🎉", "Focus on practicing Geometry problems for 10 minutes daily 📐"]

Return only the JSON array of insights.`;

      const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result?.choices?.[0]?.message?.content) {
          let text = result.choices[0].message.content.trim();
          
          // Extract JSON array
          const firstBracket = text.indexOf('[');
          const lastBracket = text.lastIndexOf(']');
          
          if (firstBracket !== -1 && lastBracket !== -1) {
            const jsonString = text.substring(firstBracket, lastBracket + 1);
            try {
              const insights = JSON.parse(jsonString);
              if (Array.isArray(insights)) {
                return insights;
              }
            } catch (parseError) {
              console.error('Error parsing insights JSON:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating fresh AI insights:', error);
    }

    // Fallback insights
    return [
      "Keep up the great work! Your consistency is paying off! 🌟",
      "Focus on your weak areas with daily practice sessions 📚",
      "You're making steady progress - every question counts! 💪",
      "Try explaining concepts to yourself to deepen understanding 🧠"
    ];
  }

  // Update personalized content based on performance
  static async updatePersonalizedContent(
    userId: string,
    chapterId: string,
    topic: string,
    wasCorrect: boolean,
    concept: string
  ): Promise<void> {
    try {
      // Get user's current understanding level for this topic
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .eq('topic', topic);

      const topicAccuracy = attempts && attempts.length > 0
        ? (attempts.filter(a => a.is_correct).length / attempts.length) * 100
        : 0;

      // Determine difficulty level
      let difficultyLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      if (topicAccuracy >= 80) difficultyLevel = 'advanced';
      else if (topicAccuracy >= 60) difficultyLevel = 'intermediate';

      // Generate personalized content
      const content = await this.generatePersonalizedContent(
        userId,
        chapterId,
        topic,
        difficultyLevel,
        wasCorrect,
        concept
      );

      // Save or update content
      const { error } = await supabase
        .from('personalized_content')
        .upsert([
          {
            user_id: userId,
            chapter_id: chapterId,
            topic,
            content_type: 'explanation',
            personalized_content: content,
            difficulty_level: difficultyLevel,
            last_updated: new Date().toISOString()
          }
        ], { onConflict: 'user_id,chapter_id,topic' });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating personalized content:', error);
    }
  }

  // Generate personalized content using AI
  static async generatePersonalizedContent(
    userId: string,
    chapterId: string,
    topic: string,
    difficultyLevel: string,
    wasCorrect: boolean,
    concept: string
  ): Promise<string> {
    try {
      const prompt = `You are a friendly math tutor creating personalized content for a student.

Student Context:
- Topic: ${topic}
- Concept: ${concept}
- Current Level: ${difficultyLevel}
- Last Question: ${wasCorrect ? 'Correct' : 'Incorrect'}
- Chapter: ${chapterId}

Create personalized study content that:
- Explains the topic in simple, engaging language
- Adapts to the student's current understanding level
- Addresses their specific needs based on recent performance
- Includes practical examples and analogies
- Uses encouraging, mentor-like tone
- Includes emojis naturally
- Provides step-by-step guidance

${wasCorrect 
  ? 'Since they got the last question right, build on their confidence and introduce slightly more challenging concepts.'
  : 'Since they struggled with the last question, provide extra support and break down the concept into smaller steps.'
}

Write as if you're a caring tutor who knows the student personally. Keep it engaging and motivational.`;

      const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result?.choices?.[0]?.message?.content) {
          return result.choices[0].message.content.trim();
        }
      }
    } catch (error) {
      console.error('Error generating personalized content:', error);
    }

    // Fallback content
    return `Let's explore ${topic} together! 🌟

${wasCorrect 
  ? `Great job on that last question! You're really getting the hang of ${concept}. Let's build on this success and explore some more challenging aspects.`
  : `Don't worry about that last question - ${concept} can be tricky! Let's break it down step by step and make sure you really understand it.`
}

Remember, every expert was once a beginner. You're doing great! 💪`;
  }

  // Get personalized roadmap for a chapter
  static async getPersonalizedRoadmap(userId: string, chapterId: string): Promise<PersonalizedRoadmap | null> {
    try {
      // Always generate roadmap using AI
      // Fetch diagnostic and performance data
      const { data: diagnostic } = await supabase
        .from('chapter_diagnostics')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .single();
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId);
      const conceptPerformance = this.analyzeConceptPerformance(attempts || []);
      const weakAreas = Object.entries(conceptPerformance)
        .filter(([_, stats]: [string, any]) => stats.accuracy < 70)
        .map(([concept, _]) => concept);
      const strongAreas = Object.entries(conceptPerformance)
        .filter(([_, stats]: [string, any]) => stats.accuracy >= 80)
        .map(([concept, _]) => concept);
      const roadmapData = await this.generateAIRoadmap(userId, chapterId, {
        diagnostic,
        weakAreas,
        strongAreas,
        recentAttempts: attempts?.slice(-10) || []
      });
      return {
        user_id: userId,
        chapter_id: chapterId,
        roadmap_data: roadmapData,
        focus_areas: weakAreas,
        priority_concepts: roadmapData.priority_concepts || [],
        total_steps: roadmapData.steps?.length || 0,
        current_step: 0,
        completion_percentage: 0,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating personalized roadmap:', error);
      return null;
    }
  }

  // Get personalized content for a topic
  static async getPersonalizedContent(userId: string, chapterId: string, topic: string): Promise<PersonalizedContent | null> {
    try {
      const { data, error } = await supabase
        .from('personalized_content')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .eq('topic', topic)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data;

      // If no personalized content, generate it using AI and performance
      if (arguments.length === 4) {
        const performance = arguments[3];
        // Compose prompt for AI
        const prompt = `You are an expert math tutor. The student ${performance.fullName || 'the student'} is in class ${performance.classLevel} and scored ${performance.testScore}% in the diagnostic test. Their strengths: ${performance.strengths.join(', ') || 'None'}. Weaknesses: ${performance.weaknesses.join(', ') || 'None'}. Explain the chapter '${topic}' in a way that matches the user performance level and very wel user should understand . Explain complete '${topic}' in very detailed and nice understanding way to ${performance.fullName || 'the student'} he should feel like this content is just made for me`;
        // Call AI model to generate content
        let aiContent = '';
        try {
          aiContent = await ProgressTrackingService.generatePersonalizedContent(
            userId,
            chapterId,
            topic,
            'intermediate',
            true,
            topic
          );
        } catch (err) {
          aiContent = `Based on your score (${performance.testScore}%) and current strengths (${performance.strengths.join(', ') || 'None'}) and weaknesses (${performance.weaknesses.join(', ') || 'None'}), here's a tailored explanation for ${topic}.`;
        }
        return {
          user_id: userId,
          chapter_id: chapterId,
          topic,
          content_type: 'explanation',
          personalized_content: aiContent,
          difficulty_level: 'intermediate',
          user_weaknesses: performance.weaknesses,
          user_strengths: performance.strengths,
          last_updated: new Date().toISOString(),
          effectiveness_score: 0,
          usage_count: 1
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting personalized content:', error);
      return null;
    }
  }

  // Get latest AI insights for user
  static async getLatestAIInsights(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ai_improvements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.improvements || [];
    } catch (error) {
      console.error('Error getting AI insights:', error);
      return [];
    }
  }

  // Start a study session
  static async startStudySession(session: Omit<StudySession, 'id' | 'ended_at' | 'duration_minutes'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...session,
          started_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error starting study session:', error);
      throw error;
    }
  }

  // End a study session
  static async endStudySession(sessionId: string, endData: Partial<StudySession>): Promise<void> {
    try {
      const endTime = new Date().toISOString();
      const { error } = await supabase
        .from('study_sessions')
        .update({
          ...endData,
          ended_at: endTime
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error ending study session:', error);
      throw error;
    }
  }

  // Save chapter diagnostic results
  static async saveChapterDiagnostic(diagnostic: ChapterDiagnostic): Promise<void> {
    try {
      const { error } = await supabase
        .from('chapter_diagnostics')
        .insert(diagnostic);

      if (error) throw error;

      // Generate initial personalized roadmap
      await this.updatePersonalizedRoadmap(diagnostic.user_id, diagnostic.chapter_id);

      // Generate AI recommendations
      await this.generateAIRecommendations(diagnostic);
    } catch (error) {
      console.error('Error saving chapter diagnostic:', error);
      throw error;
    }
  }

  // Update concept mastery
  static async updateConceptMastery(
    userId: string,
    chapterId: string,
    concept: string,
    isCorrect: boolean,
    timeSpent: number
  ): Promise<void> {
    try {
      // Get existing mastery record
      const { data: existing } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .eq('concept', concept)
        .single();

      if (existing) {
        // Update existing record
        const newAttemptsCount = existing.attempts_count + 1;
        const newCorrectAttempts = existing.correct_attempts + (isCorrect ? 1 : 0);
        const newMasteryLevel = Math.min(1.0, newCorrectAttempts / newAttemptsCount);

        const { error } = await supabase
          .from('concept_mastery')
          .update({
            attempts_count: newAttemptsCount,
            correct_attempts: newCorrectAttempts,
            mastery_level: newMasteryLevel,
            last_practiced_at: new Date().toISOString(),
            time_to_master_minutes: existing.time_to_master_minutes + Math.floor(timeSpent / 60)
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('concept_mastery')
          .insert({
            user_id: userId,
            chapter_id: chapterId,
            concept,
            mastery_level: isCorrect ? 1.0 : 0.0,
            attempts_count: 1,
            correct_attempts: isCorrect ? 1 : 0,
            last_practiced_at: new Date().toISOString(),
            time_to_master_minutes: Math.floor(timeSpent / 60)
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating concept mastery:', error);
      throw error;
    }
  }

  // Generate AI recommendations based on diagnostic results
  static async generateAIRecommendations(diagnostic: ChapterDiagnostic): Promise<void> {
    try {
      const prompt = `Analyze this student's diagnostic test results and generate specific recommendations:
        
        Chapter: ${diagnostic.chapter_id}
        Score: ${diagnostic.score_percentage}%
        Strengths: ${diagnostic.strengths.join(', ')}
        Weaknesses: ${diagnostic.weaknesses.join(', ')}
        Knowledge Gaps: ${diagnostic.knowledge_gaps.join(', ')}
        
        Generate 3-5 specific recommendations with:
        1. What to study (specific concepts)
        2. How to study (methods and resources)
        3. Practice questions types
        4. Estimated time needed
        5. Priority level (1-5)
        
        Return as JSON array with this structure:
        [
          {
            "type": "weakness_fix",
            "concept": "specific concept",
            "weakness_area": "area name",
            "recommendation": "detailed recommendation",
            "study_materials": {"videos": [], "exercises": [], "explanations": []},
            "practice_questions": {"easy": [], "medium": [], "hard": []},
            "estimated_time": 30,
            "priority": 5
          }
        ]`;

      const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: "user", content: prompt }]
        })
      });

      let recommendations = [];

      if (response.ok) {
        const data = await response.json();
        
        if (data?.choices?.[0]?.message?.content) {
          try {
            let text = data.choices[0].message.content.trim();
            text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
            
            const firstBracket = text.indexOf('[');
            const lastBracket = text.lastIndexOf(']');
            
            if (firstBracket !== -1 && lastBracket !== -1) {
              const jsonString = text.substring(firstBracket, lastBracket + 1);
              recommendations = JSON.parse(jsonString);
            }
          } catch (parseError) {
            console.error('Error parsing AI recommendations:', parseError);
          }
        }
      }

      // Save recommendations to database
      for (const rec of recommendations) {
        await supabase.from('ai_recommendations').insert({
          user_id: diagnostic.user_id,
          recommendation_type: rec.type,
          chapter_id: diagnostic.chapter_id,
          concept: rec.concept,
          weakness_area: rec.weakness_area,
          recommendation_text: rec.recommendation,
          study_materials: rec.study_materials,
          practice_questions: rec.practice_questions,
          estimated_time_minutes: rec.estimated_time,
          priority_level: rec.priority
        });
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }
  }

  // Generate comprehensive progress report with proper dates
  static async generateProgressReport(
    userId: string,
    reportType: 'daily' | 'weekly' | 'monthly' | 'chapter',
    chapterId?: string
  ): Promise<ProgressReport> {
    try {
      const endDate = new Date();
      let startDate = new Date();
      
      switch (reportType) {
        case 'daily':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'chapter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
      }

      // Get question attempts data
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('attempted_at', startDate.toISOString())
        .lte('attempted_at', endDate.toISOString());

      // Get study sessions data
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('started_at', startDate.toISOString())
        .lte('started_at', endDate.toISOString());

      // Get concept mastery data
      const { data: mastery } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId);


      // Calculate metrics
      const totalAttempts = attempts?.length || 0;
      const correctAttempts = attempts?.filter(a => a.is_correct).length || 0;
      const accuracyPercentage = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
      const totalTimeSpent = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;

      // Identify strengths and weaknesses
      const conceptStats = this.analyzeConceptPerformance(attempts || []);
      const strengths = Object.entries(conceptStats)
        .filter(([_, stats]: [string, any]) => stats.accuracy > 80)
        .map(([concept, _]) => concept);
      const weaknesses = Object.entries(conceptStats)
        .filter(([_, stats]: [string, any]) => stats.accuracy < 60)
        .map(([concept, _]) => concept);

      // Get mastered concepts
      const masteredConcepts = mastery?.filter(m => m.mastery_level >= 0.8).map(m => m.concept) || [];

      // Generate AI insights with proper data
      const aiInsights = await this.generateAIInsights(userId, {
        totalAttempts,
        accuracyPercentage,
        totalTimeSpent,
        strengths,
        weaknesses,
        masteredConcepts,
        recentSessions: sessions || [],
        reportPeriod: reportType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      // Include all question attempts in the report_data for detailed reporting
      const report: ProgressReport = {
        user_id: userId,
        report_type: reportType,
        report_period_start: startDate.toISOString(),
        report_period_end: endDate.toISOString(),
        chapter_id: chapterId,
        overall_progress: this.calculateOverallProgress(mastery || []),
        strengths_identified: strengths,
        areas_for_improvement: weaknesses,
        time_spent_minutes: totalTimeSpent,
        questions_attempted: totalAttempts,
        accuracy_percentage: accuracyPercentage,
        concepts_mastered: masteredConcepts,
        ai_insights: aiInsights,
        recommendations: await this.generateProgressRecommendations(userId, weaknesses),
        report_data: {
          attempts: attempts || [],
          conceptStats,
          sessionBreakdown: this.analyzeSessionBreakdown(sessions || []),
          difficultyProgression: this.analyzeDifficultyProgression(attempts || [])
        }
      };

      // Save report to database
      const { data, error } = await supabase
        .from('progress_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  }

  // Generate AI insights for progress report
  static async generateAIInsights(userId: string, data: any): Promise<string> {
    try {
      const prompt = `You are an expert math tutor analyzing a student's learning progress over the ${data.reportPeriod} period.

Performance Data (${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()}):
- Total Questions Attempted: ${data.totalAttempts}
- Overall Accuracy: ${data.accuracyPercentage.toFixed(1)}%
- Study Time: ${data.totalTimeSpent} minutes
- Strong Areas: ${data.strengths.join(', ') || 'Still identifying'}
- Areas for Improvement: ${data.weaknesses.join(', ') || 'None identified'}
- Concepts Mastered: ${data.masteredConcepts.join(', ') || 'Building foundation'}
- Study Sessions: ${data.recentSessions.length}

Provide a comprehensive, personalized analysis that includes:
1. Celebration of achievements and progress
2. Specific observations about learning patterns
3. Areas where the student is excelling
4. Constructive feedback on areas for improvement
5. Motivational insights about their learning journey
6. Specific next steps and recommendations

Write in an encouraging, mentor-like tone as if you know the student personally. Be specific about their performance and provide actionable insights. Keep it conversational and supportive.

Length: 3-4 paragraphs, detailed but not overwhelming.`;

      const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const result = await response.json();
      
        if (result?.choices?.[0]?.message?.content) {
          return result.choices[0].message.content.trim();
        }
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
    
    return `Great work during this ${data.reportPeriod} period! You've attempted ${data.totalAttempts} questions with ${data.accuracyPercentage.toFixed(1)}% accuracy. 

Your dedication to learning is evident from your ${data.totalTimeSpent} minutes of study time. ${data.strengths.length > 0 ? `You're particularly strong in ${data.strengths[0]}, which shows your growing mathematical confidence!` : 'You\'re building a solid foundation across all areas.'}

${data.weaknesses.length > 0 ? `Focus on ${data.weaknesses[0]} in your upcoming sessions - with consistent practice, you'll see improvement soon!` : 'Keep up the balanced approach to learning!'} Remember, every expert was once a beginner, and you're making steady progress on your mathematical journey! 🌟`;
  }

  // Analyze concept performance
  private static analyzeConceptPerformance(attempts: any[]): any {
    const conceptStats: any = {};
    
    attempts.forEach(attempt => {
      if (!attempt.concept) return;
      
      if (!conceptStats[attempt.concept]) {
        conceptStats[attempt.concept] = {
          total: 0,
          correct: 0,
          accuracy: 0,
          avgTime: 0,
          totalTime: 0
        };
      }
      
      conceptStats[attempt.concept].total++;
      if (attempt.is_correct) conceptStats[attempt.concept].correct++;
      conceptStats[attempt.concept].totalTime += attempt.time_taken_seconds;
    });
    
    // Calculate averages
    Object.keys(conceptStats).forEach(concept => {
      const stats = conceptStats[concept];
      stats.accuracy = (stats.correct / stats.total) * 100;
      stats.avgTime = stats.totalTime / stats.total;
    });
    
    return conceptStats;
  }

  // Calculate overall progress
  private static calculateOverallProgress(masteryData: any[]): number {
    if (masteryData.length === 0) return 0;
    
    const totalMastery = masteryData.reduce((sum, m) => sum + m.mastery_level, 0);
    return (totalMastery / masteryData.length) * 100;
  }

  // Analyze session breakdown
  private static analyzeSessionBreakdown(sessions: any[]): any {
    const breakdown = {
      byType: {} as any,
      byDay: {} as any,
      avgDuration: 0
    };
    
    sessions.forEach(session => {
      // By type
      if (!breakdown.byType[session.session_type]) {
        breakdown.byType[session.session_type] = { count: 0, totalTime: 0 };
      }
      breakdown.byType[session.session_type].count++;
      breakdown.byType[session.session_type].totalTime += session.duration_minutes;
      
      // By day
      const day = new Date(session.started_at).toDateString();
      if (!breakdown.byDay[day]) {
        breakdown.byDay[day] = { sessions: 0, totalTime: 0 };
      }
      breakdown.byDay[day].sessions++;
      breakdown.byDay[day].totalTime += session.duration_minutes;
    });
    
    const totalTime = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    breakdown.avgDuration = sessions.length > 0 ? totalTime / sessions.length : 0;
    
    return breakdown;
  }

  // Analyze difficulty progression
  private static analyzeDifficultyProgression(attempts: any[]): any {
    const progression = {
      easy: { total: 0, correct: 0, accuracy: 0 },
      medium: { total: 0, correct: 0, accuracy: 0 },
      hard: { total: 0, correct: 0, accuracy: 0 }
    };
    
    attempts.forEach(attempt => {
      if (progression[attempt.difficulty as keyof typeof progression]) {
        progression[attempt.difficulty as keyof typeof progression].total++;
        if (attempt.is_correct) {
          progression[attempt.difficulty as keyof typeof progression].correct++;
        }
      }
    });
    
    // Calculate accuracy for each difficulty
    Object.keys(progression).forEach(difficulty => {
      const diff = progression[difficulty as keyof typeof progression];
      diff.accuracy = diff.total > 0 ? (diff.correct / diff.total) * 100 : 0;
    });
    
    return progression;
  }

  // Generate progress-based recommendations
  private static async generateProgressRecommendations(userId: string, weaknesses: string[]): Promise<string[]> {
    const recommendations = [
      "Continue your daily practice routine - consistency is key! 📚",
      "Great job on maintaining focus during study sessions! 🎯"
    ];
    
    if (weaknesses.length > 0) {
      recommendations.push(`Focus extra attention on ${weaknesses[0]} - you're getting there! 💪`);
      recommendations.push(`Try breaking down ${weaknesses[0]} into smaller concepts for better understanding 🧩`);
    }
    
    return recommendations;
  }

  // Get user's learning analytics
  static async getUserAnalytics(userId: string, chapterId?: string): Promise<any> {
    try {
      const baseQuery = supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId);
      
      if (chapterId) {
        baseQuery.eq('chapter_id', chapterId);
      }
      
      const { data: attempts } = await baseQuery;
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId);
      
      const { data: mastery } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId);
      
      const { data: recommendations } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('priority_level', { ascending: false });

      // Calculate total study time from sessions and question attempts
      const sessionMinutes = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
      const attemptMinutes = attempts?.reduce((sum, a) => sum + ((a.time_taken_seconds || 0) / 60), 0) || 0;
      const totalStudyTime = Math.round(sessionMinutes + attemptMinutes);
      return {
        attempts: attempts || [],
        sessions: sessions || [],
        mastery: mastery || [],
        recommendations: recommendations || [],
        analytics: {
          totalQuestions: attempts?.length || 0,
          correctAnswers: attempts?.filter(a => a.is_correct).length || 0,
          accuracy: attempts?.length ? (attempts.filter(a => a.is_correct).length / attempts.length) * 100 : 0,
          totalStudyTime,
          conceptsMastered: mastery?.filter(m => m.mastery_level >= 0.8).length || 0
        }
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Check if user has taken diagnostic for chapter
  static async hasUserTakenDiagnostic(userId: string, chapterId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('chapter_diagnostics')
        .select('id')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking diagnostic status:', error);
      return false;
    }
  }

  // Get chapter diagnostic results
  static async getChapterDiagnostic(userId: string, chapterId: string): Promise<ChapterDiagnostic | null> {
    try {
      const { data, error } = await supabase
        .from('chapter_diagnostics')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting chapter diagnostic:', error);
      return null;
    }
  }
}