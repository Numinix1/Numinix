import { StudyPlan, Chapter, DiagnosticResult } from '../types';
import chaptersData from '../data/chapters.json';

const GROQ_PROXY_URL = 'http://localhost:3001/api/groq-chat';
const MODEL_NAME = 'openai/gpt-oss-20b';

export async function generatePersonalizedStudyPlan(
  chapterId: string,
  diagnosticResult: DiagnosticResult,
  userProgress: any
): Promise<StudyPlan> {
  const chapter = chaptersData.find(c => c.id === chapterId);
  if (!chapter) {
    throw new Error('Chapter not found');
  }

  try {
    const prompt = `Create a personalized study plan for this student based on their diagnostic results.

Chapter: ${chapter.chapter}
Topics: ${chapter.topics.join(', ')}
Student's Strengths: ${diagnosticResult.strengths.join(', ')}
Student's Weaknesses: ${diagnosticResult.weaknesses.join(', ')}
Student's Gaps: ${diagnosticResult.gaps.join(', ')}
Diagnostic Score: ${diagnosticResult.score}/${diagnosticResult.total_questions}

Generate a study plan as JSON with this structure:
{
  "chapter_id": "${chapterId}",
  "prerequisites": ["concept1", "concept2"],
  "recommended_practice": ["practice1", "practice2", "practice3"],
  "estimated_time": 120,
  "difficulty_level": "beginner"
}

Prerequisites should be concepts the student needs to review first.
Recommended practice should be specific, actionable study activities.
Estimated time should be in minutes for completing this chapter.
Difficulty level should be "beginner", "intermediate", or "advanced" based on student's readiness.

Return only the JSON object.`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
    
      if (data?.choices?.[0]?.message?.content) {
        let text = data.choices[0].message.content.trim();
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      
        const studyPlan = JSON.parse(text);
        return studyPlan;
      }
    }
  } catch (error) {
    console.error('Error generating study plan:', error);
  }

  // Fallback study plan
  const prerequisites = diagnosticResult.gaps.length > 0 
    ? diagnosticResult.gaps.slice(0, 3)
    : ['Basic arithmetic', 'Number concepts'];
    
  const difficultyLevel = diagnosticResult.score / diagnosticResult.total_questions >= 0.7 
    ? 'intermediate' 
    : 'beginner';

  return {
    chapter_id: chapterId,
    prerequisites,
    recommended_practice: [
      'Complete 10 practice problems daily',
      'Review concept explanations',
      'Take mini-quizzes to test understanding',
      'Practice with real-world examples'
    ],
    estimated_time: difficultyLevel === 'beginner' ? 180 : 120,
    difficulty_level: difficultyLevel as 'beginner' | 'intermediate' | 'advanced'
  };
}

export async function generateChapterExplanation(
  chapterId: string,
  topic: string,
  studentLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<string> {
  try {
    const prompt = `You are a friendly math mentor explaining ${topic} to a ${studentLevel} student. 

Create an engaging, interactive explanation that:
- Uses simple, clear language
- Includes fun analogies and examples
- Uses emojis naturally
- Feels like a conversation with a helpful friend
- Never mentions being an AI
- Includes practical examples
- Makes the concept feel approachable and interesting

Keep it concise but comprehensive. Make the student feel excited about learning this topic!

Topic: ${topic}
Student Level: ${studentLevel}`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    }
  } catch (error) {
    console.error('Error generating explanation:', error);
  }

  // Fallback explanation
  return `Let's explore ${topic} together! 🌟

This is an important concept that will help you understand mathematics better. Think of it as building blocks - each piece helps you construct something amazing!

We'll start with the basics and gradually build up your understanding. Don't worry if it seems challenging at first - that's completely normal! 💪

Remember: every expert was once a beginner. You're on an exciting journey of discovery! 🚀`;
}

export async function generateSmartNotification(
  userProgress: any,
  recentActivity: string[]
): Promise<string> {
  try {
    const prompt = `Generate a motivational, personalized notification for a student based on their progress.

Recent Activity: ${recentActivity.join(', ')}
Progress Info: Strong areas, areas for improvement, recent achievements

Create a short, encouraging message that:
- Celebrates their progress
- Provides specific next steps
- Uses emojis appropriately
- Feels personal and motivating
- Is under 100 characters
- Never mentions being AI

Examples:
"Amazing work on Algebra! 🚀 Ready to tackle Geometry next?"
"Great streak! 🔥 Try the Number Systems quiz to keep momentum going!"

Return just the notification text.`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    }
  } catch (error) {
    console.error('Error generating notification:', error);
  }

  // Fallback notifications
  const fallbackNotifications = [
    "You're making great progress! 🌟 Keep up the amazing work!",
    "Ready for your next challenge? 🚀 Let's keep learning!",
    "Fantastic effort today! 💪 Tomorrow brings new discoveries!",
    "You're on fire! 🔥 Your dedication is paying off!"
  ];

  return fallbackNotifications[Math.floor(Math.random() * fallbackNotifications.length)];
}

export async function generatePersonalizedStudyContent(
  chapterId: string,
  chapterName: string,
  userLevel: 'beginner' | 'intermediate' | 'advanced',
  userWeaknesses: string[] = [],
  userStrengths: string[] = []
): Promise<{ [topic: string]: string }> {
  try {
    const prompt = `You are a friendly math mentor creating personalized study content for a student.

Chapter: ${chapterName}
Student Level: ${userLevel}
Student's Strengths: ${userStrengths.join(', ') || 'Building foundation'}
Student's Weaknesses: ${userWeaknesses.join(', ') || 'None identified'}

Create personalized study content for 4 key topics in this chapter. Return as JSON object:
{
  "Introduction": "Engaging introduction content...",
  "Core Concepts": "Core concepts explanation...",
  "Problem Solving": "Problem solving strategies...",
  "Practice & Review": "Practice and review guidance..."
}

Each content section should:
- Be 2-3 paragraphs long
- Use encouraging, mentor-like tone
- Address student's specific level and needs
- Include practical examples and analogies
- Use emojis naturally
- Build confidence while being educational
- Reference their strengths and help with weaknesses

Return only the JSON object.`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data?.choices?.[0]?.message?.content) {
        let text = data.choices[0].message.content.trim();
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('Error parsing study content JSON:', parseError);
        }
      }
    }
  } catch (error) {
    console.error('Error generating personalized study content:', error);
  }

  // Fallback content
  return {
    "Introduction": `Welcome to ${chapterName}! 🌟\n\nThis chapter will build on your existing knowledge and introduce exciting new concepts. ${userStrengths.length > 0 ? `Your strength in ${userStrengths[0]} will be very helpful here!` : 'We\'ll start with the basics and build up your understanding step by step.'}\n\nGet ready for an amazing learning adventure! 🚀`,
    "Core Concepts": `Let's dive into the heart of ${chapterName}! 💡\n\nWe'll explore the fundamental ideas that make this topic so important in mathematics. ${userWeaknesses.length > 0 ? `Don't worry about ${userWeaknesses[0]} - we'll work on that together!` : 'You\'re well-prepared for these concepts!'}\n\nRemember, every expert was once a beginner. Take your time and enjoy the process! 📚`,
    "Problem Solving": `Now for the exciting part - solving problems! 🎯\n\nWe'll learn strategies and techniques that will make you confident in tackling any question. Practice makes perfect, and every mistake is a learning opportunity.\n\nYou've got this! Let's turn challenges into victories! 💪`,
    "Practice & Review": `Time to reinforce your learning! ⭐\n\nRegular practice and review will help cement these concepts in your mind. ${userStrengths.length > 0 ? `Use your strength in ${userStrengths[0]} to build confidence!` : 'Focus on understanding rather than memorizing.'}\n\nCelebrate every small win - you're making amazing progress! 🎉`
  };
}