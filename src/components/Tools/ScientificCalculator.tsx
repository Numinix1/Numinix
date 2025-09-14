import React, { useState } from 'react';

interface ScientificCalculatorProps {
  onBack?: () => void;
}

export function ScientificCalculator({ onBack }: ScientificCalculatorProps) {
  // Allowed keys for keyboard input
  const allowedKeys = [
    '0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','(',')','^'
  ];
  const funcKeys: Record<string, string> = {
    s: 'sin',
    c: 'cos',
    t: 'tan',
    l: 'log',
    r: 'sqrt'
  };

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') {
        handleCalculate();
        e.preventDefault();
      } else if (e.key === 'Backspace') {
        setExpression(prev => prev.slice(0, -1));
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setExpression('');
        setResult(null);
        e.preventDefault();
      } else if (allowedKeys.includes(e.key)) {
        setExpression(prev => prev + e.key);
        e.preventDefault();
      } else if (Object.keys(funcKeys).includes(e.key)) {
        setExpression(prev => prev + funcKeys[e.key as keyof typeof funcKeys] + '(');
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Button type for calculator buttons
  type Button = {
    label: string;
    type: string;
    wide?: boolean;
  };

  // Button layout for a real scientific calculator
  const buttonRows: Button[][] = [
    [
      { label: 'C', type: 'action' },
      { label: 'DEL', type: 'action' },
      { label: '(', type: 'operator' },
      { label: ')', type: 'operator' },
      { label: '/', type: 'operator' }
    ],
    [
      { label: '7', type: 'number' },
      { label: '8', type: 'number' },
      { label: '9', type: 'number' },
      { label: '*', type: 'operator' },
      { label: 'sqrt', type: 'func' }
    ],
    [
      { label: '4', type: 'number' },
      { label: '5', type: 'number' },
      { label: '6', type: 'number' },
      { label: '-', type: 'operator' },
      { label: '^', type: 'operator' }
    ],
    [
      { label: '1', type: 'number' },
      { label: '2', type: 'number' },
      { label: '3', type: 'number' },
      { label: '+', type: 'operator' },
      { label: 'log', type: 'func' }
    ],
    [
      { label: '0', type: 'number' },
      { label: '.', type: 'number' },
      { label: 'sin', type: 'func' },
      { label: 'cos', type: 'func' },
      { label: 'tan', type: 'func' }
    ],
    [
      { label: '=', type: 'equal', wide: true }
    ]
  ];

  function handleButtonClick(val: string) {
    if (val === 'C') {
      setExpression('');
      setResult(null);
    } else if (val === 'DEL') {
      setExpression(expression.slice(0, -1));
    } else if (val === '=') {
      handleCalculate();
    } else if (val === 'sqrt') {
      setExpression(expression + 'sqrt(');
    } else if (val === 'sin') {
      setExpression(expression + 'sin(');
    } else if (val === 'cos') {
      setExpression(expression + 'cos(');
    } else if (val === 'tan') {
      setExpression(expression + 'tan(');
    } else if (val === 'log') {
      setExpression(expression + 'log(');
    } else if (val === '^') {
      setExpression(expression + '^');
    } else {
      setExpression(expression + val);
    }
  }

  function handleCalculate() {
    try {
      // Replace functions and ^ for eval
      let expr = expression
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log(')
        .replace(/\^/g, '**');
      const res = eval(expr);
      setResult(res.toString());
    } catch {
      setResult('Invalid expression');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <span className="text-blue-600">&larr;</span>
            <span>Back to Tools</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Scientific Calculator</h1>
        <div className="flex space-x-6 items-start">
          <div className="flex-1 space-y-6">
            <input
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg mb-2"
              type="text"
              value={expression}
              onChange={() => {}}
              placeholder="Enter expression (use keyboard or buttons)"
              readOnly
            />
            <div className="space-y-2 mb-4">
              {buttonRows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-5 gap-2">
                  {row.map((btn, colIdx) => (
                    <button
                      key={colIdx}
                      className={`px-3 py-3 text-lg rounded-lg transition-colors font-semibold ${
                        btn.type === 'number'
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : btn.type === 'operator'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : btn.type === 'func'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : btn.type === 'action'
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : btn.type === 'equal'
                          ? 'bg-green-600 text-white hover:bg-green-700 col-span-5'
                          : 'invisible'
                      } ${btn.wide ? 'col-span-5' : ''}`}
                      onClick={() => btn.label && handleButtonClick(btn.label)}
                      disabled={!btn.label}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {result !== null && (
            <div className="w-64 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 ml-2">
              <div className="text-center">
                <div className="text-sm text-green-600 mb-2">Result:</div>
                <div className="text-3xl font-bold text-green-800">{result}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
