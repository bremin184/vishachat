import React, { useState } from 'react';
import { NeonButton } from '@/components/ui/NeonButton';

interface WouldYouRatherProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

const scenarios = [
  {
    optionA: 'Have the ability to fly',
    optionB: 'Have the ability to become invisible',
  },
  {
    optionA: 'Be able to speak all languages',
    optionB: 'Be able to talk to animals',
  },
  {
    optionA: 'Never have to sleep',
    optionB: 'Never have to eat',
  },
  {
    optionA: 'Live in the mountains',
    optionB: 'Live by the beach',
  },
  {
    optionA: 'Be famous',
    optionB: 'Be wealthy but unknown',
  },
  {
    optionA: 'Have a rewind button for your life',
    optionB: 'Have a pause button for your life',
  },
  {
    optionA: 'Know what everyone is thinking',
    optionB: 'Know what will happen in the future',
  },
  {
    optionA: 'Be the funniest person in the room',
    optionB: 'Be the smartest person in the room',
  },
];

export const WouldYouRather: React.FC<WouldYouRatherProps> = ({ isAI, onGameEnd }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [playerChoices, setPlayerChoices] = useState<string[]>([]);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleChoice = (choice: 'A' | 'B') => {
    const playerPick = choice === 'A' ? scenario.optionA : scenario.optionB;
    setPlayerChoices([...playerChoices, playerPick]);

    // AI makes a random choice
    const aiPick = Math.random() > 0.5 ? scenario.optionA : scenario.optionB;
    setAiChoice(aiPick);
    setRevealed(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((s) => s + 1);
      setAiChoice(null);
      setRevealed(false);
    } else {
      onGameEnd('draw'); // It's a social game, no winner
    }
  };

  const isGameOver = currentScenario >= scenarios.length - 1 && revealed;

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6">
        <span className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1} of {scenarios.length}
        </span>
      </div>

      <h3 className="text-2xl font-display font-bold text-gradient mb-8">
        Would You Rather...
      </h3>

      <div className="space-y-4 mb-6">
        <button
          onClick={() => handleChoice('A')}
          disabled={revealed}
          className={`w-full p-6 rounded-xl text-lg font-medium transition-all border-2 ${
            revealed && playerChoices[playerChoices.length - 1] === scenario.optionA
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted hover:border-primary/50'
          }`}
        >
          {scenario.optionA}
          {revealed && aiChoice === scenario.optionA && (
            <span className="ml-2 text-sm text-secondary">🤖 AI chose this</span>
          )}
        </button>

        <div className="text-muted-foreground font-bold">OR</div>

        <button
          onClick={() => handleChoice('B')}
          disabled={revealed}
          className={`w-full p-6 rounded-xl text-lg font-medium transition-all border-2 ${
            revealed && playerChoices[playerChoices.length - 1] === scenario.optionB
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted hover:border-primary/50'
          }`}
        >
          {scenario.optionB}
          {revealed && aiChoice === scenario.optionB && (
            <span className="ml-2 text-sm text-secondary">🤖 AI chose this</span>
          )}
        </button>
      </div>

      {revealed && (
        <div className="mt-6">
          {isGameOver ? (
            <p className="text-lg font-semibold">Thanks for playing! 🎉</p>
          ) : (
            <NeonButton onClick={nextScenario}>Next Scenario</NeonButton>
          )}
        </div>
      )}
    </div>
  );
};
