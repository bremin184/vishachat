import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Gamepad2, Zap, Bot, Users } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { games } from '@/data/games';
import { Game } from '@/types';

const Games: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'strategy', name: 'Strategy', icon: '🎯' },
    { id: 'trivia', name: 'Trivia', icon: '🧠' },
    { id: 'party', name: 'Party', icon: '🎉' },
    { id: 'casual', name: 'Casual', icon: '🎮' },
  ];

  const getGamesByCategory = (category: string) =>
    games.filter((g) => g.category === category);

  const handlePlayGame = (game: Game, withAI: boolean) => {
    navigate(`/games/${game.id}?ai=${withAI}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-display font-bold text-gradient">VISHA</h1>
          <NeonButton variant="ghost" size="sm" onClick={() => navigate('/lobby')}>
            <Users className="w-4 h-4" />
          </NeonButton>
        </header>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
            <Gamepad2 className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary">14 Games Available</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-2">Game Library</h2>
          <p className="text-muted-foreground">
            Play with friends or challenge the AI
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => (
          <section key={category.id} className="mb-12">
            <h3 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getGamesByCategory(category.id).map((game) => (
                <GlassPanel key={game.id} className="p-5 group">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <h4 className="font-display font-semibold mb-1">{game.name}</h4>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="flex gap-2">
                    {game.supportsAI && (
                      <NeonButton
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePlayGame(game, true)}
                        className="flex-1"
                      >
                        <Bot className="w-3 h-3" />
                        vs AI
                      </NeonButton>
                    )}
                    <NeonButton
                      size="sm"
                      onClick={() => handlePlayGame(game, false)}
                      className="flex-1"
                    >
                      <Users className="w-3 h-3" />
                      Online
                    </NeonButton>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Games;
