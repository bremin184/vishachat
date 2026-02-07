import React, { useState, useEffect } from 'react';

interface TicTacToeProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

type Cell = 'X' | 'O' | null;

export const TicTacToe: React.FC<TicTacToeProps> = ({ isAI, onGameEnd }) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'draw' | null>(null);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  const checkWinner = (squares: Cell[]): Cell | 'draw' | null => {
    for (const [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((cell) => cell !== null)) return 'draw';
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      const gameResult = result === 'X' ? 'player' : result === 'O' ? 'opponent' : 'draw';
      setWinner(gameResult);
      onGameEnd(gameResult);
    } else {
      setIsPlayerTurn(false);
    }
  };

  // AI Move
  useEffect(() => {
    if (isAI && !isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const emptyIndices = board
          .map((cell, index) => (cell === null ? index : -1))
          .filter((index) => index !== -1);

        if (emptyIndices.length > 0) {
          // Simple AI: Try to win, block, or random
          let move = -1;

          // Try to win
          for (const idx of emptyIndices) {
            const testBoard = [...board];
            testBoard[idx] = 'O';
            if (checkWinner(testBoard) === 'O') {
              move = idx;
              break;
            }
          }

          // Try to block
          if (move === -1) {
            for (const idx of emptyIndices) {
              const testBoard = [...board];
              testBoard[idx] = 'X';
              if (checkWinner(testBoard) === 'X') {
                move = idx;
                break;
              }
            }
          }

          // Center or random
          if (move === -1) {
            if (emptyIndices.includes(4)) move = 4;
            else move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          }

          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result) {
            const gameResult = result === 'X' ? 'player' : result === 'O' ? 'opponent' : 'draw';
            setWinner(gameResult);
            onGameEnd(gameResult);
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, isAI, winner]);

  const getCellStyle = (cell: Cell) => {
    if (cell === 'X') return 'text-primary';
    if (cell === 'O') return 'text-secondary';
    return '';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        {winner ? (
          <h3 className="text-xl font-display font-bold">
            {winner === 'draw' ? "It's a Draw!" : winner === 'player' ? 'You Win! 🎉' : 'AI Wins!'}
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">
            {isPlayerTurn ? 'Your Turn (X)' : 'AI Thinking...'}
          </h3>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`w-24 h-24 text-5xl font-bold rounded-xl bg-muted border-2 border-border 
              hover:border-primary/50 transition-all disabled:cursor-not-allowed
              ${getCellStyle(cell)}
              ${!cell && isPlayerTurn && !winner ? 'hover:bg-muted/80' : ''}`}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};
