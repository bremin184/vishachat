import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bot, Users } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { games } from '@/data/games';

interface GameSelectorProps {
  onClose: () => void;
  opponent: 'human' | 'ai';
}

export const GameSelector: React.FC<GameSelectorProps> = ({ onClose, opponent }) => {
  const navigate = useNavigate();

  const handleSelectGame = (gameId: string) => {
    navigate(`/games/${gameId}?ai=${opponent === 'ai'}`);
  };

  const availableGames = opponent === 'ai' 
    ? games.filter(g => g.supportsAI)
    : games;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            {opponent === 'ai' ? (
              <>
                <Bot className="w-5 h-5 text-secondary" />
                Play with AI
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-primary" />
                Play Together
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className="p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/50 transition-all text-left group"
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {game.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {game.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <NeonButton variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </NeonButton>
        </div>
      </GlassPanel>
    </div>
  );
};
