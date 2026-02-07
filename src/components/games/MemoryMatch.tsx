import React, { useState, useEffect } from 'react';

interface MemoryMatchProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

const emojis = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎤'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ isAI, onGameEnd }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = flippedCards;

      if (cards[first].emoji === cards[second].emoji) {
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);

        // Check if all matched
        if (newCards.every((c) => c.isMatched)) {
          setIsComplete(true);
          onGameEnd('player');
        }
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        {isComplete ? (
          <h3 className="text-xl font-display font-bold">
            Completed in {moves} moves! 🎉
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">Moves: {moves}</h3>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xs">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
            className={`w-16 h-16 rounded-xl text-3xl transition-all duration-300 transform
              ${card.isFlipped || card.isMatched
                ? 'bg-primary/20 border-primary rotate-0'
                : 'bg-muted border-border hover:scale-105 rotate-y-180'
              } border-2`}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};
