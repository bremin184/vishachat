import React, { useState, useEffect } from 'react';

interface HangmanProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

const words = [
  'JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'COMPUTER', 'ALGORITHM',
  'DATABASE', 'FRONTEND', 'BACKEND', 'FRAMEWORK', 'INTERFACE',
  'FUNCTION', 'VARIABLE', 'COMPONENT', 'ANIMATION', 'RESPONSIVE',
];

export const Hangman: React.FC<HangmanProps> = ({ isAI, onGameEnd }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrong) {
        onGameEnd('opponent');
      }
    } else {
      // Check if won
      const allGuessed = word.split('').every((l) => newGuessed.has(l));
      if (allGuessed) {
        onGameEnd('player');
      }
    }
  };

  const displayWord = word
    .split('')
    .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const isGameOver = wrongGuesses >= maxWrong || word.split('').every((l) => guessedLetters.has(l));
  const isWinner = word.split('').every((l) => guessedLetters.has(l));

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center">
      {/* Hangman Drawing */}
      <div className="mb-6 text-6xl">
        {wrongGuesses >= maxWrong ? '💀' : wrongGuesses > 3 ? '😰' : '😊'}
      </div>

      {/* Wrong Guesses */}
      <div className="mb-4 flex gap-2">
        {Array.from({ length: maxWrong }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < wrongGuesses ? 'bg-destructive' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Word Display */}
      <div className="text-4xl font-display font-bold mb-8 tracking-widest">
        {isGameOver && !isWinner ? word : displayWord}
      </div>

      {/* Result */}
      {isGameOver && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-display font-bold">
            {isWinner ? 'You Win! 🎉' : `Game Over! The word was ${word}`}
          </h3>
        </div>
      )}

      {/* Keyboard */}
      {!isGameOver && (
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter)}
              className={`w-10 h-10 rounded-lg font-bold transition-all
                ${
                  guessedLetters.has(letter)
                    ? word.includes(letter)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-destructive/50 text-destructive-foreground opacity-50'
                    : 'bg-muted hover:bg-muted/80 hover:scale-105'
                }`}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
