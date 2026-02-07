import React, { useState, useEffect } from 'react';
import { NeonButton } from '@/components/ui/NeonButton';

interface RockPaperScissorsProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

type Choice = 'rock' | 'paper' | 'scissors' | null;

const choices: { id: Choice; emoji: string; name: string }[] = [
  { id: 'rock', emoji: '✊', name: 'Rock' },
  { id: 'paper', emoji: '✋', name: 'Paper' },
  { id: 'scissors', emoji: '✌️', name: 'Scissors' },
];

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ isAI, onGameEnd }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<'player' | 'opponent' | 'draw' | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const determineWinner = (player: Choice, opponent: Choice): 'player' | 'opponent' | 'draw' => {
    if (player === opponent) return 'draw';
    if (
      (player === 'rock' && opponent === 'scissors') ||
      (player === 'paper' && opponent === 'rock') ||
      (player === 'scissors' && opponent === 'paper')
    ) {
      return 'player';
    }
    return 'opponent';
  };

  const handleChoice = (choice: Choice) => {
    if (countdown !== null) return;
    setPlayerChoice(choice);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 500);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const aiChoice = choices[Math.floor(Math.random() * choices.length)].id;
      setOpponentChoice(aiChoice);
      
      const winner = determineWinner(playerChoice, aiChoice);
      setResult(winner);
      onGameEnd(winner);
      setCountdown(null);
    }
  }, [countdown, playerChoice]);

  const reset = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setCountdown(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Countdown */}
      {countdown !== null && countdown > 0 && (
        <div className="text-center mb-8">
          <div className="text-8xl font-display font-bold text-gradient animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-display font-bold mb-4">
            {result === 'draw' ? "It's a Tie!" : result === 'player' ? 'You Win! 🎉' : 'AI Wins!'}
          </h3>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-2">
                {choices.find((c) => c.id === playerChoice)?.emoji}
              </div>
              <p className="text-sm text-muted-foreground">You</p>
            </div>
            <span className="text-2xl font-bold">vs</span>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {choices.find((c) => c.id === opponentChoice)?.emoji}
              </div>
              <p className="text-sm text-muted-foreground">AI</p>
            </div>
          </div>
          <NeonButton onClick={reset}>Play Again</NeonButton>
        </div>
      )}

      {/* Choices */}
      {!result && countdown === null && (
        <>
          <h3 className="text-xl font-display font-semibold mb-6">Make Your Choice</h3>
          <div className="flex gap-4">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className={`w-28 h-28 text-5xl rounded-2xl bg-muted border-2 border-border 
                  hover:border-primary hover:scale-110 transition-all
                  ${playerChoice === choice.id ? 'border-primary bg-primary/10' : ''}`}
              >
                {choice.emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
