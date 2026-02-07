import React, { useState, useEffect } from 'react';
import { NeonButton } from '@/components/ui/NeonButton';

interface WordChainProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

const wordDatabase = [
  'apple', 'elephant', 'tiger', 'rabbit', 'tornado', 'ocean', 'night',
  'tree', 'eagle', 'eclipse', 'energy', 'yellow', 'water', 'rainbow',
  'window', 'wonder', 'rocket', 'theater', 'robot', 'tennis', 'summer',
];

export const WordChain: React.FC<WordChainProps> = ({ isAI, onGameEnd }) => {
  const [words, setWords] = useState<{ word: string; player: 'you' | 'ai' }[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Start with a random word
  useEffect(() => {
    const startWord = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
    setWords([{ word: startWord, player: 'ai' }]);
  }, []);

  const getLastLetter = () => {
    if (words.length === 0) return '';
    return words[words.length - 1].word.slice(-1).toLowerCase();
  };

  const handleSubmit = () => {
    const word = currentWord.toLowerCase().trim();
    
    if (!word) {
      setError('Please enter a word');
      return;
    }

    if (word[0] !== getLastLetter()) {
      setError(`Word must start with "${getLastLetter().toUpperCase()}"`);
      return;
    }

    if (words.some((w) => w.word.toLowerCase() === word)) {
      setError('Word already used!');
      return;
    }

    if (word.length < 3) {
      setError('Word must be at least 3 letters');
      return;
    }

    setWords([...words, { word, player: 'you' }]);
    setCurrentWord('');
    setError('');
    setIsPlayerTurn(false);
  };

  // AI turn
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const lastLetter = getLastLetter();
        const usedWords = words.map((w) => w.word.toLowerCase());
        
        const validWords = wordDatabase.filter(
          (w) => w[0] === lastLetter && !usedWords.includes(w)
        );

        if (validWords.length > 0) {
          const aiWord = validWords[Math.floor(Math.random() * validWords.length)];
          setWords([...words, { word: aiWord, player: 'ai' }]);
          setIsPlayerTurn(true);
        } else {
          // AI can't find a word
          setGameOver(true);
          onGameEnd('player');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, words, gameOver]);

  const handleGiveUp = () => {
    setGameOver(true);
    onGameEnd('opponent');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        {gameOver ? (
          <h3 className="text-xl font-display font-bold">
            {words[words.length - 1]?.player === 'ai' ? 'AI Wins!' : 'You Win! 🎉'}
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">
            {isPlayerTurn ? `Your turn! Start with "${getLastLetter().toUpperCase()}"` : 'AI is thinking...'}
          </h3>
        )}
      </div>

      {/* Word History */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
        {words.map((w, i) => (
          <div
            key={i}
            className={`inline-block px-3 py-1 m-1 rounded-lg text-sm ${
              w.player === 'you' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {w.word}
          </div>
        ))}
      </div>

      {/* Input */}
      {!gameOver && isPlayerTurn && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={`Word starting with ${getLastLetter().toUpperCase()}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:outline-none"
            />
            <NeonButton onClick={handleSubmit}>Submit</NeonButton>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            onClick={handleGiveUp}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Give Up
          </button>
        </div>
      )}

      {!gameOver && !isPlayerTurn && (
        <div className="flex justify-center">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};
