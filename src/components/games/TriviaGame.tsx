import React, { useState, useEffect } from 'react';
import { NeonButton } from '@/components/ui/NeonButton';

interface TriviaGameProps {
  isAI: boolean;
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'],
    correct: 0,
  },
  {
    question: 'Which language runs in a web browser?',
    options: ['Java', 'C++', 'Python', 'JavaScript'],
    correct: 3,
  },
  {
    question: 'What year was JavaScript created?',
    options: ['1990', '1995', '2000', '1985'],
    correct: 1,
  },
  {
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Creative Style System', 'Cascading Style Sheets', 'Colorful Style Sheets'],
    correct: 2,
  },
  {
    question: 'Which company developed React?',
    options: ['Google', 'Microsoft', 'Facebook', 'Amazon'],
    correct: 2,
  },
];

export const TriviaGame: React.FC<TriviaGameProps> = ({ isAI, onGameEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      const won = score >= questions.length / 2;
      onGameEnd(won ? 'player' : 'opponent');
    }
  };

  if (gameOver) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold mb-4">
          {score >= questions.length / 2 ? 'You Win! 🎉' : 'Better luck next time!'}
        </h3>
        <p className="text-xl mb-6">
          Score: {score}/{questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex gap-1 justify-center mt-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i < currentQuestion ? 'bg-primary' : i === currentQuestion ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-center mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showResult}
            className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
              showResult
                ? index === question.correct
                  ? 'border-green-500 bg-green-500/10'
                  : index === selectedAnswer
                  ? 'border-destructive bg-destructive/10'
                  : 'border-border bg-muted/50'
                : 'border-border bg-muted hover:border-primary/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="text-center">
          <p className="mb-4 font-semibold">
            {selectedAnswer === question.correct ? '✅ Correct!' : '❌ Wrong!'}
          </p>
          <NeonButton onClick={nextQuestion}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </NeonButton>
        </div>
      )}
    </div>
  );
};
