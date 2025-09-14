import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import conversionsData from '../../data/unitConversions.json';

interface UnitConverterProps {
  onBack?: () => void;
}

export function UnitConverter({ onBack }: UnitConverterProps) {
  const [value, setValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('centimeters');
  const [result, setResult] = useState('');

  const categories = ['Length', 'Weight', 'Volume', 'Time', 'Temperature'];

  const getUnitsForCategory = (category: string) => {
    const units = new Set<string>();
    conversionsData
      .filter(conv => conv.category === category)
      .forEach(conv => {
        units.add(conv.from);
        units.add(conv.to);
      });
    return Array.from(units);
  };

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('Please enter a valid number');
      return;
    }

    if (fromUnit === toUnit) {
      setResult(`${numValue} ${toUnit}`);
      return;
    }

    // Special case for temperature
    if (selectedCategory === 'Temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        const fahrenheit = (numValue * 9/5) + 32;
        setResult(`${fahrenheit.toFixed(2)} °F`);
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        const celsius = (numValue - 32) * 5/9;
        setResult(`${celsius.toFixed(2)} °C`);
      }
      return;
    }

    // Find direct conversion
    const conversion = conversionsData.find(
      conv => conv.from === fromUnit && conv.to === toUnit
    );

    if (conversion) {
      const convertedValue = numValue * conversion.factor;
      setResult(`${convertedValue.toFixed(6)} ${toUnit}`);
    } else {
      // Try reverse conversion
      const reverseConversion = conversionsData.find(
        conv => conv.from === toUnit && conv.to === fromUnit
      );
      
      if (reverseConversion) {
        const convertedValue = numValue / reverseConversion.factor;
        setResult(`${convertedValue.toFixed(6)} ${toUnit}`);
      } else {
        setResult('Conversion not available');
      }
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue('');
    setResult('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tools</span>
          </button>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Unit Converter</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    const units = getUnitsForCategory(category);
                    setFromUnit(units[0] || '');
                    setToUnit(units[1] || units[0] || '');
                    setValue('');
                    setResult('');
                  }}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getUnitsForCategory(selectedCategory).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Swap units"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getUnitsForCategory(selectedCategory).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convert}
            disabled={!value}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
          >
            <span>Convert</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
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