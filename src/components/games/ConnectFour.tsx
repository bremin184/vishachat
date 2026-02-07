import React, { useState, useEffect } from 'react';

interface ConnectFourProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

type Cell = 'player' | 'opponent' | null;

const ROWS = 6;
const COLS = 7;

export const ConnectFour: React.FC<ConnectFourProps> = ({ isAI, onGameEnd }) => {
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'draw' | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const checkWinner = (b: Cell[][]): Cell | 'draw' | null => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const cell = b[r][c];
        if (cell && cell === b[r][c + 1] && cell === b[r][c + 2] && cell === b[r][c + 3]) {
          return cell;
        }
      }
    }

    // Check vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        const cell = b[r][c];
        if (cell && cell === b[r + 1][c] && cell === b[r + 2][c] && cell === b[r + 3][c]) {
          return cell;
        }
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const cell = b[r][c];
        if (cell && cell === b[r + 1][c + 1] && cell === b[r + 2][c + 2] && cell === b[r + 3][c + 3]) {
          return cell;
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const cell = b[r][c];
        if (cell && cell === b[r - 1][c + 1] && cell === b[r - 2][c + 2] && cell === b[r - 3][c + 3]) {
          return cell;
        }
      }
    }

    // Check draw
    if (b.every((row) => row.every((cell) => cell !== null))) {
      return 'draw';
    }

    return null;
  };

  const getLowestRow = (col: number): number => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) return r;
    }
    return -1;
  };

  const dropPiece = (col: number, player: Cell) => {
    const row = getLowestRow(col);
    if (row === -1) return false;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      if (result === 'draw') {
        setWinner('draw');
        onGameEnd('draw');
      } else {
        setWinner(result);
        onGameEnd(result);
      }
      return true;
    }
    return false;
  };

  const handleClick = (col: number) => {
    if (winner || !isPlayerTurn || getLowestRow(col) === -1) return;

    const gameEnded = dropPiece(col, 'player');
    if (!gameEnded) {
      setIsPlayerTurn(false);
    }
  };

  // AI Move
  useEffect(() => {
    if (isAI && !isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const validCols = [];
        for (let c = 0; c < COLS; c++) {
          if (getLowestRow(c) !== -1) validCols.push(c);
        }

        if (validCols.length > 0) {
          // Simple AI: random move
          const col = validCols[Math.floor(Math.random() * validCols.length)];
          const gameEnded = dropPiece(col, 'opponent');
          if (!gameEnded) {
            setIsPlayerTurn(true);
          }
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, isAI]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        {winner ? (
          <h3 className="text-xl font-display font-bold">
            {winner === 'draw' ? "It's a Draw!" : winner === 'player' ? 'You Win! 🎉' : 'AI Wins!'}
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">
            {isPlayerTurn ? 'Your Turn (Red)' : 'AI Thinking...'}
          </h3>
        )}
      </div>

      <div className="bg-blue-600 p-3 rounded-xl">
        <div className="grid grid-cols-7 gap-1.5">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(c)}
                onMouseEnter={() => setHoverCol(c)}
                onMouseLeave={() => setHoverCol(null)}
                disabled={!!winner || !isPlayerTurn}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full transition-all bg-blue-800"
              >
                <div
                  className={`w-full h-full rounded-full transition-all ${
                    cell === 'player'
                      ? 'bg-red-500'
                      : cell === 'opponent'
                      ? 'bg-yellow-400'
                      : hoverCol === c && r === getLowestRow(c) && isPlayerTurn && !winner
                      ? 'bg-red-500/30'
                      : 'bg-blue-900'
                  }`}
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
