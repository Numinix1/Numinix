import React, { useState } from 'react';

interface TimeCalculatorProps {
  onBack?: () => void;
}

export function TimeCalculator({ onBack }: TimeCalculatorProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function handleCalculate() {
    if (!start || !end) {
      setResult('Please enter both times');
      return;
    }
    const startDate = new Date(`1970-01-01T${start}:00Z`);
    const endDate = new Date(`1970-01-01T${end}:00Z`);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setResult('Invalid time format');
      return;
    }
    let diff = (endDate.getTime() - startDate.getTime()) / 1000; // seconds
    if (diff < 0) diff += 24 * 3600; // handle overnight
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    setResult(`${hours} hours, ${minutes} minutes`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-white rounded-lg shadow">
      {onBack && (
        <button className="mb-4 text-orange-600" onClick={onBack}>&larr; Back</button>
      )}
      <h2 className="text-2xl font-bold mb-2 text-orange-700">Time Calculator</h2>
      <p className="mb-4 text-gray-600">Calculate the difference between two times (24-hour format).</p>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        type="time"
        value={start}
        onChange={e => setStart(e.target.value)}
        placeholder="Start Time"
      />
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        type="time"
        value={end}
        onChange={e => setEnd(e.target.value)}
        placeholder="End Time"
      />
      <button
        className="w-full bg-orange-600 text-white py-2 rounded mb-2"
        onClick={handleCalculate}
      >
        Calculate
      </button>
      {result !== null && (
        <div className="mt-2 text-lg text-gray-800">Difference: <span className="font-bold">{result}</span></div>
      )}
    </div>
  );
}
