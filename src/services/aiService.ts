// import { GEMINI_API_KEY } from '../config/geminiApiKey';

export interface AIResponse {
	solution: string;
	steps: string[];
	confidence: number;
	error?: string;
}

export async function solveMathProblem(question: string): Promise<AIResponse> {
	try {
		const GROQ_PROXY_URL = 'http://localhost:3001/api/groq-chat';
		const messages = [
			{ role: "system", content: "You are MathMentor, a super-smart, friendly, and fun math assistant inside the Numinix app. Follow the same rules and style as before." },
			{ role: "user", content: question }
		];
		const response = await fetch(GROQ_PROXY_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "openai/gpt-oss-20b",
				messages
			})
		});
		if (!response.ok) {
			let errorText = await response.text();
			console.error('Groq API error:', response.status, response.statusText, errorText);
			throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
		}
		const data = await response.json();
		return {
			solution: data.choices?.[0]?.message?.content || "",
			steps: [],
			confidence: 1,
			error: undefined
		};
	} catch (error: any) {
		return {
			solution: '',
			steps: [],
			confidence: 0,
			error: error.message
		};
	}
}

// Personalized AI quiz question generator
export async function generateQuestions(userProfile: any, selectedChapters: string[]): Promise<any[]> {
	try {
		const GROQ_PROXY_URL = 'http://localhost:3001/api/groq-chat';
		
		// Gather personalization data
		const classLevel = userProfile.class_level;
		const strengths = userProfile.strengths || [];
		const weaknesses = userProfile.weaknesses || [];
		const unlockedChapters = userProfile.unlocked_chapters || [];
		
		// You may want to fetch chapter/topic names from chaptersData if needed
		// For now, just pass selectedChapters as is
		
		const prompt = `You are a math quiz generator for class ${classLevel} students. Personalize the questions based on the following:

Strengths: ${strengths.join(', ') || 'None'}
Weaknesses: ${weaknesses.join(', ') || 'None'}
Unlocked Chapters: ${unlockedChapters.join(', ') || 'None'}
Selected Chapters: ${selectedChapters.join(', ') || 'None'}

Return ONLY a valid JSON array with this exact structure:
[
  { "id": "q1", "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "correct_answer": "4", "explanation": "2 + 2 equals 4 because we add two and two together.", "difficulty": "easy", "class_level": ${classLevel}, "topic": "Addition" }
]

Requirements:
- Exactly 10 questions
- Questions appropriate for class ${classLevel}
- Mix of easy, medium, and hard difficulty
- Focus on selected chapters and user weaknesses
- Each question must have exactly 4 options
- Clear explanations
- Valid JSON format only, no extra text`;

		const messages = [
			{ role: "system", content: prompt },
			{ role: "user", content: `Generate 10 personalized math quiz questions for class ${classLevel}.` }
		];
		
		const response = await fetch(GROQ_PROXY_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "openai/gpt-oss-20b",
				messages
			})
		});
		if (!response.ok) {
			throw new Error(`Groq API error: ${response.statusText}`);
		}
		const data = await response.json();
		console.log('AI raw Groq response:', data);
		let rawText = data.choices?.[0]?.message?.content?.trim() || '';
		console.log('AI rawText before cleanup:', rawText);
		// Clean up the response - remove markdown formatting
		rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
		console.log('AI rawText after cleanup:', rawText);
		// Try to find JSON array in the response
		const jsonMatch = rawText.match(/\[[\s\S]*\]/);
		if (jsonMatch) {
			rawText = jsonMatch[0];
			console.log('AI extracted JSON array:', rawText);
		}
		let generatedQuestions: any[] = [];
		try {
			generatedQuestions = JSON.parse(rawText);
			if (!Array.isArray(generatedQuestions)) {
				throw new Error('Response is not an array');
			}
			generatedQuestions = generatedQuestions.filter(q => 
				q.id && q.question && q.options && Array.isArray(q.options) && 
				q.correct_answer && q.explanation && q.difficulty && q.topic
			);
			if (generatedQuestions.length === 0) {
				throw new Error('No valid questions generated');
			}
			generatedQuestions = generatedQuestions.slice(0, 10);
		} catch (parseError) {
			console.error('JSON Parse Error:', parseError);
			console.error('Raw text:', rawText);
			throw new Error(`Failed to parse AI response: ${parseError}`);
		}
		return generatedQuestions;
	} catch (error: any) {
		console.error('AI Question Generation Error:', error);
		// Return fallback questions instead of error
		return [
			{
				id: "fallback_1",
				question: `What is the value of 5 × 6?`,
				options: ["25", "30", "35", "40"],
				correct_answer: "30",
				explanation: "5 × 6 = 30. When we multiply 5 by 6, we get 30.",
				difficulty: "easy",
				class_level: userProfile.class_level,
				topic: "Multiplication"
			},
			{
				id: "fallback_2", 
				question: `If x + 7 = 15, what is the value of x?`,
				options: ["6", "7", "8", "9"],
				correct_answer: "8",
				explanation: "To find x, we subtract 7 from both sides: x = 15 - 7 = 8.",
				difficulty: "medium",
				class_level: userProfile.class_level,
				topic: "Algebra"
			},
			{
				id: "fallback_3",
				question: `What is the area of a rectangle with length 8 cm and width 5 cm?`,
				options: ["13 cm²", "26 cm²", "40 cm²", "45 cm²"],
				correct_answer: "40 cm²",
				explanation: "Area of rectangle = length × width = 8 × 5 = 40 cm².",
				difficulty: "easy",
				class_level: userProfile.class_level,
				topic: "Geometry"
			}
		];
	}
}