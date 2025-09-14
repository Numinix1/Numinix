import { useState } from 'react';

function getRandomNumbers() {
  const nums: number[] = [];
  while (nums.length < 4) {
    const n = Math.floor(Math.random() * 9) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
}

function getRandomTarget(nums: number[]) {
  // Target is sum, product, or difference of some numbers
  const ops = [
    () => nums[0] + nums[1],
    () => nums[1] * nums[2],
    () => nums[2] + nums[3],
    () => nums[0] * nums[3],
    () => nums[0] + nums[1] + nums[2],
    () => nums[0] * nums[1] - nums[2],
  ];
  return ops[Math.floor(Math.random() * ops.length)]();
}

export default function TargetNumber() {
  const [numbers, setNumbers] = useState<number[]>(getRandomNumbers());
  const [target, setTarget] = useState<number>(getRandomTarget(numbers));
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleSelect = (num: number) => {
    if (selected.includes(num)) return;
    if (selected.length < 3) {
      setSelected([...selected, num]);
      setMessage('');
    }
  };

  const handleCalculate = () => {
    if (selected.length < 2) {
      setMessage('Select at least two numbers.');
      return;
    }
    // Try all operations
    const [a, b, c] = selected;
    const results = [
      a + b,
      a * b,
      a + b + (c || 0),
      a * b - (c || 0),
      a * b * (c || 1),
      a - b,
      b - a,
    ];
    if (results.includes(target)) {
      setResult(target);
      setMessage('Congratulations! You reached the target.');
    } else {
      setResult(null);
      setMessage('Try again!');
    }
  };

  const resetGame = () => {
    const nums = getRandomNumbers();
    setNumbers(nums);
    setTarget(getRandomTarget(nums));
    setSelected([]);
    setResult(null);
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Target Number</h2>
        <div className="mb-4 text-lg text-orange-700 font-semibold text-center">Target: <span className="font-bold">{target}</span></div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {numbers.map(num => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              disabled={selected.includes(num)}
              className={`w-14 h-14 text-xl font-bold rounded-lg border-2 focus:outline-none transition-colors
                ${selected.includes(num) ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-orange-50 border-orange-400 hover:bg-orange-200'}
              `}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="mb-4 text-center text-gray-700">Selected: {selected.join(', ') || '-'}</div>
        <button
          onClick={handleCalculate}
          className="w-full bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition-colors mb-2"
          disabled={selected.length < 2}
        >
          Calculate
        </button>
        <button
          onClick={resetGame}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
        {message && (
          <div className="mt-4 text-center font-bold text-lg text-orange-700">
            {message}
            {message === 'Try again!' && (
              <button
                onClick={() => {
                  setSelected([]);
                  setResult(null);
                  setMessage('');
                }}
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
