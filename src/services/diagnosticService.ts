import { DiagnosticQuestion, DiagnosticResult } from '../types';

const GROQ_PROXY_URL = 'http://localhost:3001/api/groq-chat';
const MODEL_NAME = 'openai/gpt-oss-20b';

export async function generateDiagnosticTest(classLevel: number): Promise<DiagnosticQuestion[]> {
  try {
    const chapterConcepts = getPrerequisiteConceptsForClass(classLevel);
    
    const prompt = `You are an expert math educator creating diagnostic questions for Class ${classLevel} students in India following NCERT curriculum.

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON array
2. No markdown formatting, no explanations, no additional text
3. Must be parseable JSON

Create exactly 15 diagnostic questions that test prerequisite knowledge needed for Class ${classLevel} mathematics.

Focus on these prerequisite concepts:
${chapterConcepts}

Return this exact JSON structure:
[
  {
    "id": "diag_1",
    "question": "What is 15 + 27?",
    "options": ["42", "41", "43", "40"],
    "correct_answer": "42",
    "explanation": "15 + 27 = 42. Add ones: 5+7=12, write 2 carry 1. Add tens: 1+2+1=4.",
    "difficulty": "medium",
    "topic": "Basic Arithmetic",
    "concept": "Addition"
  }
]

Requirements:
- Mix of difficulties: 6 easy, 6 medium, 3 hard
- Test prerequisite knowledge only
- Clear, student-friendly explanations
- Return ONLY the JSON array`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    const aiContent = data?.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error('Invalid response from AI: No content');
    }

    let rawText = aiContent.trim();

    // Clean up response
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    // Find the JSON array boundaries
    const firstBracket = rawText.indexOf('[');
    const lastBracket = rawText.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1 || firstBracket >= lastBracket) {
      throw new Error('No valid JSON array found in AI response');
    }

    const jsonString = rawText.substring(firstBracket, lastBracket + 1);

    let questions;
    try {
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions generated');
    }

    // Validate questions
    const validQuestions = questions.filter(q => 
      q.id && q.question && q.options && Array.isArray(q.options) && 
      q.correct_answer && q.explanation && q.difficulty && q.topic && q.concept
    );

    if (validQuestions.length === 0) {
      throw new Error('No valid questions found in response');
    }

    return validQuestions.slice(0, 15);
  } catch (error) {
    console.error('Diagnostic test generation error:', error);
    return generateFallbackDiagnosticQuestions(classLevel);
  }
}

function getPrerequisiteConceptsForClass(classLevel: number): string {
  const concepts = {
    1: "Basic counting, simple addition/subtraction, shape recognition",
    2: "Addition/subtraction up to 1000, multiplication tables, basic shapes",
    3: "Multiplication/division, basic fractions, measurement units",
    4: "Large numbers, proper/improper fractions, basic decimals, angles",
    5: "Decimal operations, factors/multiples, area/perimeter",
    6: "Integers, fraction/decimal operations, basic algebra, ratios",
    7: "Rational numbers, simple equations, lines/angles, triangles",
    8: "Rational number operations, linear equations, quadrilaterals",
    9: "Number systems, basic polynomials, coordinate geometry basics",
    10: "Real numbers, polynomial operations, quadratic concepts",
    11: "Advanced algebra, basic trigonometry, sequences",
    12: "Pre-calculus concepts, advanced probability, vectors"
  };
  
  return concepts[classLevel as keyof typeof concepts] || concepts[9];
}

function generateFallbackDiagnosticQuestions(classLevel: number): DiagnosticQuestion[] {
  const baseQuestions: DiagnosticQuestion[] = [
    {
      id: "diag_1",
      question: "What is 15 + 27?",
      options: ["42", "41", "43", "40"],
      correct_answer: "42",
      explanation: "15 + 27 = 42. Add the ones place: 5 + 7 = 12, write 2 carry 1. Add tens: 1 + 2 + 1 = 4.",
      difficulty: "easy",
      topic: "Basic Arithmetic",
      concept: "Addition"
    },
    {
      id: "diag_2",
      question: "Which of these is a rational number?",
      options: ["√2", "π", "3/4", "√5"],
      correct_answer: "3/4",
      explanation: "A rational number can be expressed as p/q where q ≠ 0. 3/4 is in this form.",
      difficulty: "medium",
      topic: "Number Systems",
      concept: "Rational Numbers"
    },
    {
      id: "diag_3",
      question: "What is 2³?",
      options: ["6", "8", "9", "4"],
      correct_answer: "8",
      explanation: "2³ means 2 × 2 × 2 = 8",
      difficulty: "easy",
      topic: "Exponents",
      concept: "Powers"
    },
    {
      id: "diag_4",
      question: "What is the area of a square with side 5 cm?",
      options: ["20 cm²", "25 cm²", "10 cm²", "15 cm²"],
      correct_answer: "25 cm²",
      explanation: "Area of square = side × side = 5 × 5 = 25 cm²",
      difficulty: "easy",
      topic: "Geometry",
      concept: "Area calculation"
    },
    {
      id: "diag_5",
      question: "If 3x = 15, what is x?",
      options: ["3", "4", "5", "6"],
      correct_answer: "5",
      explanation: "To find x, divide both sides by 3: x = 15 ÷ 3 = 5",
      difficulty: "medium",
      topic: "Algebra",
      concept: "Simple equations"
    }
  ];

  // Add more questions to reach 15
  const additionalQuestions: DiagnosticQuestion[] = [];
  for (let i = 6; i <= 15; i++) {
    additionalQuestions.push({
      id: `diag_${i}`,
      question: `What is ${i + 2} + ${i + 3}?`,
      options: [`${2*i + 4}`, `${2*i + 5}`, `${2*i + 6}`, `${2*i + 7}`],
      correct_answer: `${2*i + 5}`,
      explanation: `${i + 2} + ${i + 3} = ${2*i + 5}`,
      difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
      topic: "Basic Arithmetic",
      concept: "Addition"
    });
  }

  return [...baseQuestions, ...additionalQuestions];
}

export async function analyzeDiagnosticResults(
  answers: { questionId: string; answer: string; correct: boolean }[],
  questions: DiagnosticQuestion[]
): Promise<DiagnosticResult> {
  const score = answers.filter(a => a.correct).length;
  const totalQuestions = questions.length;
  
  // Analyze by topic and concept
  const topicScores: { [key: string]: { correct: number; total: number } } = {};
  const conceptScores: { [key: string]: { correct: number; total: number } } = {};
  
  answers.forEach((answer, index) => {
    const question = questions[index];
    if (!question) return;
    
    // Track topic performance
    if (!topicScores[question.topic]) {
      topicScores[question.topic] = { correct: 0, total: 0 };
    }
    topicScores[question.topic].total++;
    if (answer.correct) topicScores[question.topic].correct++;
    
    // Track concept performance
    if (!conceptScores[question.concept]) {
      conceptScores[question.concept] = { correct: 0, total: 0 };
    }
    conceptScores[question.concept].total++;
    if (answer.correct) conceptScores[question.concept].correct++;
  });
  
  // Determine strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const gaps: string[] = [];
  
  Object.entries(topicScores).forEach(([topic, scores]) => {
    const percentage = (scores.correct / scores.total) * 100;
    if (percentage >= 80) {
      strengths.push(topic);
    } else if (percentage >= 50) {
      // Moderate performance - could improve
    } else {
      weaknesses.push(topic);
    }
    
    if (percentage < 30) {
      gaps.push(topic);
    }
  });
  
  // Generate AI-powered recommendations
  const recommendations = await generateRecommendations(strengths, weaknesses, gaps, score, totalQuestions);
  
  return {
    id: Date.now().toString(),
    user_id: '', // Will be set by caller
    score,
    total_questions: totalQuestions,
    strengths,
    weaknesses,
    gaps,
    recommendations,
    completed_at: new Date().toISOString()
  };
}

async function generateRecommendations(
  strengths: string[],
  weaknesses: string[],
  gaps: string[],
  score: number,
  totalQuestions: number
): Promise<string[]> {
  try {
    const prompt = `You are a friendly math mentor. Based on diagnostic results, provide 5 personalized recommendations.

Results:
- Score: ${score}/${totalQuestions} (${Math.round((score/totalQuestions)*100)}%)
- Strengths: ${strengths.join(', ') || 'None identified'}
- Weaknesses: ${weaknesses.join(', ') || 'None identified'}
- Major gaps: ${gaps.join(', ') || 'None identified'}

Return ONLY a JSON array of recommendation strings:
["recommendation 1", "recommendation 2", ...]

Each recommendation should be:
- Encouraging and positive
- Specific and actionable
- Include emojis
- Written like a friendly mentor`;

    const response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
        
        // Extract JSON array
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < lastBracket) {
          const jsonString = text.substring(firstBracket, lastBracket + 1);
          
          try {
            const recommendations = JSON.parse(jsonString);
            if (Array.isArray(recommendations)) {
              return recommendations;
            }
          } catch (parseError) {
            console.error('Recommendations JSON parsing failed:', parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }
  
  // Fallback recommendations
  const fallbackRecommendations = [
    `You scored ${score}/${totalQuestions}! 🎉 Every step forward is progress.`,
    "Focus on daily practice - even 15 minutes makes a difference! 📚",
    "Don't worry about mistakes - they're stepping stones to success! 💪"
  ];
  
  if (strengths.length > 0) {
    fallbackRecommendations.push(`You're doing great with ${strengths[0]}! 🌟 Keep it up!`);
  }
  
  if (weaknesses.length > 0) {
    fallbackRecommendations.push(`Let's work on ${weaknesses[0]} together - you've got this! 🚀`);
  }
  
  return fallbackRecommendations;
}