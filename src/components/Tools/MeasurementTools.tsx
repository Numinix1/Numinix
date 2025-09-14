import React, { useState } from 'react';

const measurementTypes = [
  { id: 'area', label: 'Area (Rectangle)', color: 'purple' },
  { id: 'volume', label: 'Volume (Box)', color: 'purple' },
  { id: 'perimeter', label: 'Perimeter (Rectangle)', color: 'purple' },
];

interface MeasurementToolsProps {
  onBack?: () => void;
}

export function MeasurementTools({ onBack }: MeasurementToolsProps) {
  const [type, setType] = useState('area');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lengthUnit, setLengthUnit] = useState('cm');
  const [widthUnit, setWidthUnit] = useState('cm');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [result, setResult] = useState<string | null>(null);

  function handleCalculate() {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    let res = '';
    if (type === 'area') {
      res = isNaN(l) || isNaN(w)
        ? 'Invalid input'
        : `${l * w} ${lengthUnit} × ${widthUnit}`;
    } else if (type === 'volume') {
      res = isNaN(l) || isNaN(w) || isNaN(h)
        ? 'Invalid input'
        : `${l * w * h} ${lengthUnit} × ${widthUnit} × ${heightUnit}`;
    } else if (type === 'perimeter') {
      res = isNaN(l) || isNaN(w)
        ? 'Invalid input'
        : `${2 * (l + w)} ${lengthUnit} + ${widthUnit}`;
    }
    setResult(res);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-white rounded-lg shadow">
      {onBack && (
        <button className="mb-4 text-purple-600" onClick={onBack}>&larr; Back</button>
      )}
      <h2 className="text-2xl font-bold mb-2 text-purple-700">Measurement Tools</h2>
      <p className="mb-4 text-gray-600">Select a measurement type and enter values.</p>
      <select
        className="w-full border rounded px-3 py-2 mb-2"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        {measurementTypes.map(mt => (
          <option key={mt.id} value={mt.id}>{mt.label}</option>
        ))}
      </select>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          type="number"
          value={length}
          onChange={e => setLength(e.target.value)}
          placeholder="Length"
        />
        <select
          className="border rounded px-2 py-2"
          value={lengthUnit}
          onChange={e => setLengthUnit(e.target.value)}
        >
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="mm">mm</option>
          <option value="in">in</option>
          <option value="ft">ft</option>
        </select>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          type="number"
          value={width}
          onChange={e => setWidth(e.target.value)}
          placeholder="Width"
        />
        <select
          className="border rounded px-2 py-2"
          value={widthUnit}
          onChange={e => setWidthUnit(e.target.value)}
        >
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="mm">mm</option>
          <option value="in">in</option>
          <option value="ft">ft</option>
        </select>
      </div>
      {type === 'volume' && (
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="Height"
          />
          <select
            className="border rounded px-2 py-2"
            value={heightUnit}
            onChange={e => setHeightUnit(e.target.value)}
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="mm">mm</option>
            <option value="in">in</option>
            <option value="ft">ft</option>
          </select>
        </div>
      )}
      {type === 'volume' && (
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          type="number"
          value={height}
          onChange={e => setHeight(e.target.value)}
          placeholder="Height"
        />
      )}
      <button
        className="w-full bg-purple-600 text-white py-2 rounded mb-2"
        onClick={handleCalculate}
      >
        Calculate
      </button>
      {result !== null && (
        <div className="mt-2 text-lg text-gray-800">Result: <span className="font-bold">{result}</span></div>
      )}
    </div>
  );
}
