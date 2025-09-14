import { useState } from 'react';

const initialBoard: (number | '')[] = [1, 2, 3, 4, 5, 6, 7, 8, ''];

function shuffle(array: (number | '')[]): (number | '')[] {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isSolved(board: (number | '')[]): boolean {
  for (let i = 0; i < 8; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[8] === '';
}

export default function NumberPuzzle() {
  const [board, setBoard] = useState<(number | '')[]>(() => shuffle(initialBoard));
  const [message, setMessage] = useState('');

  const moveTile = (idx: number) => {
    const emptyIdx = board.indexOf('');
    const validMoves = [emptyIdx - 1, emptyIdx + 1, emptyIdx - 3, emptyIdx + 3];
    if (validMoves.includes(idx) &&
      ((emptyIdx % 3 === 0 && idx === emptyIdx - 1) ||
       (emptyIdx % 3 === 2 && idx === emptyIdx + 1)) === false) {
      const newBoard = board.slice();
      [newBoard[emptyIdx], newBoard[idx]] = [newBoard[idx], newBoard[emptyIdx]];
      setBoard(newBoard);
      setMessage('');
    }
  };

  const handleTileClick = (idx: number) => {
    moveTile(idx);
    if (isSolved(board)) {
      setMessage('Congratulations! You solved the puzzle.');
    }
  };

  const resetGame = () => {
    setBoard(shuffle(initialBoard));
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Number Puzzle</h2>
        <div className="grid grid-cols-3 gap-2 bg-gray-200 rounded-lg p-2 mb-4">
          {board.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              disabled={tile === ''}
              className={`w-16 h-16 text-xl font-bold rounded-lg border-2 focus:outline-none transition-colors
                ${tile === '' ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-blue-50 border-blue-400 hover:bg-blue-100'}
              `}
            >
              {tile !== '' ? tile : ''}
            </button>
          ))}
        </div>
        {message && <div className="mt-4 text-green-600 text-center font-bold">{message}</div>}
        <button
          onClick={resetGame}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
