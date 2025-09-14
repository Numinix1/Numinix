import { useState } from 'react';

const teasers = [
  {
    question: 'What comes next in the sequence: 2, 4, 8, 16, ?',
    options: ['18', '24', '32', '64'],
    answer: '32',
    explanation: 'Each number is multiplied by 2. 16 × 2 = 32.'
  },
  {
    question: 'If you rearrange the letters "CIFAIPC" you get the name of a(n):',
    options: ['City', 'Ocean', 'Animal', 'Country'],
    answer: 'Ocean',
    explanation: 'Rearrange to "PACIFIC", which is an ocean.'
  },
  {
    question: 'Which number should come next: 1, 1, 2, 3, 5, 8, ?',
    options: ['10', '11', '13', '15'],
    answer: '13',
    explanation: 'This is the Fibonacci sequence. 8 + 5 = 13.'
  },
  {
    question: 'What is always in front of you but can’t be seen?',
    options: ['Air', 'Future', 'Shadow', 'Mirror'],
    answer: 'Future',
    explanation: 'The future is always ahead but invisible.'
  }
];

export default function BrainTeaser() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleOption = (option: string) => {
    setSelected(option);
    setShowResult(true);
    if (option === teasers[current].answer) {
      setScore(score + 1);
    }
  };

  const nextTeaser = () => {
    setCurrent(current + 1);
    setSelected('');
    setShowResult(false);
  };

  const resetGame = () => {
    setCurrent(0);
    setSelected('');
    setShowResult(false);
    setScore(0);
  };

  if (current >= teasers.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brain Teaser Complete!</h2>
          <div className="text-lg text-green-700 mb-4">Your Score: {score} / {teasers.length}</div>
          <button
            onClick={resetGame}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const teaser = teasers[current];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Brain Teaser</h2>
        <div className="mb-6 text-lg text-blue-700 font-semibold text-center">{teaser.question}</div>
        <div className="grid grid-cols-1 gap-3 mb-4">
          {teaser.options.map(option => (
            <button
              key={option}
              onClick={() => handleOption(option)}
              disabled={showResult}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left font-bold
                ${showResult
                  ? option === teaser.answer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : option === selected && option !== teaser.answer
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-gray-50'
                  : selected === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
        {showResult && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-900">
            <div className="font-semibold mb-2">Explanation:</div>
            <div>{teaser.explanation}</div>
            <button
              onClick={nextTeaser}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
