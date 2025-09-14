import { useState } from 'react';

const initialBoard: (number | '')[][] = [
  [5, 3, '', '', 7, '', '', '', ''],
  [6, '', '', 1, 9, 5, '', '', ''],
  ['', 9, 8, '', '', '', '', 6, ''],
  [8, '', '', '', 6, '', '', '', 3],
  [4, '', '', 8, '', 3, '', '', 1],
  [7, '', '', '', 2, '', '', '', 6],
  ['', 6, '', '', '', '', 2, 8, ''],
  ['', '', '', 4, 1, 9, '', '', 5],
  ['', '', '', '', 8, '', '', 7, 9],
];

function isValid(board: (number | '')[][], row: number, col: number, value: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === value) return false;
    }
  }
  return true;
}

export default function Sudoku() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [message, setMessage] = useState('');

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setMessage('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const { row, col } = selectedCell;
    if (row === null || col === null) return;
    if (value === '' || (/^[1-9]$/.test(value) && isValid(board, row, col, Number(value)))) {
      const newBoard = board.map(arr => arr.slice());
      newBoard[row][col] = value === '' ? '' : Number(value);
      setBoard(newBoard);
      setMessage('');
    } else {
      setMessage('Invalid move!');
    }
  };

  const isComplete = board.flat().every(cell => cell !== '');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Sudoku Game</h2>
        <div className="grid grid-cols-9 gap-1 bg-gray-200 rounded-lg p-2">
          {board.map((rowArr, rowIdx) =>
            rowArr.map((cell, colIdx) => (
              <input
                key={`${rowIdx}-${colIdx}`}
                type="text"
                maxLength={1}
                value={cell}
                disabled={initialBoard[rowIdx][colIdx] !== ''}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                onChange={handleInput}
                className={`w-10 h-10 text-center text-lg font-bold rounded-md border-2 focus:outline-none transition-colors
                  ${selectedCell.row === rowIdx && selectedCell.col === colIdx ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                  ${initialBoard[rowIdx][colIdx] !== '' ? 'bg-gray-100 text-gray-400' : ''}
                  ${colIdx % 3 === 2 && colIdx !== 8 ? 'border-r-4 border-gray-400' : ''}
                  ${rowIdx % 3 === 2 && rowIdx !== 8 ? 'border-b-4 border-gray-400' : ''}
                `}
              />
            ))
          )}
        </div>
        {message && <div className="mt-4 text-red-600 text-center">{message}</div>}
        {isComplete && <div className="mt-4 text-green-600 text-center font-bold">Congratulations! You completed the Sudoku.</div>}
      </div>
    </div>
  );
}
