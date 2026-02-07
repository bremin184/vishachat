import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Gamepad2,
  Shuffle,
  Users,
  ArrowRight,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useApp } from '@/context/AppContext';
import { mockUsers, getOnlineUsers } from '@/data/mockUsers';
import { Gender, MatchMode } from '@/types';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { matchPreferences, setMatchPreferences } = useApp();
  const [selectedMode, setSelectedMode] = useState<MatchMode>(matchPreferences.mode);
  const [myGender, setMyGender] = useState<Gender | undefined>(matchPreferences.myGender);
  const [preferredGender, setPreferredGender] = useState<Gender | undefined>(
    matchPreferences.preferredGender
  );

  const onlineUsers = getOnlineUsers();

  const handleStartMatching = () => {
    setMatchPreferences({
      mode: selectedMode,
      myGender,
      preferredGender,
    });
    navigate('/chat');
  };

  const handleConnectToUser = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-display font-bold text-gradient">VISHA</h1>
          <NeonButton variant="ghost" size="sm" onClick={() => navigate('/games')}>
            <Gamepad2 className="w-4 h-4" />
          </NeonButton>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matching Options */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel className="p-6">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-primary" />
                Match Mode
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSelectedMode('dynamic')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMode === 'dynamic'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Shuffle className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Dynamic</h3>
                  <p className="text-xs text-muted-foreground">Random matching</p>
                </button>

                <button
                  onClick={() => setSelectedMode('opposite')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMode === 'opposite'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <h3 className="font-semibold">Opposite</h3>
                  <p className="text-xs text-muted-foreground">Gender preference</p>
                </button>
              </div>

              {selectedMode === 'opposite' && (
                <div className="space-y-4 animate-slide-up">
                  <div>
                    <label className="text-sm font-medium mb-2 block">I am</label>
                    <div className="flex gap-2">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setMyGender(g)}
                          className={`px-4 py-2 rounded-lg capitalize transition-all ${
                            myGender === g
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Looking for</label>
                    <div className="flex gap-2">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setPreferredGender(g)}
                          className={`px-4 py-2 rounded-lg capitalize transition-all ${
                            preferredGender === g
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <NeonButton onClick={handleStartMatching} className="w-full mt-6">
                <Video className="w-5 h-5" />
                Start Video Chat
                <ArrowRight className="w-4 h-4" />
              </NeonButton>
            </GlassPanel>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <GlassPanel
                className="p-5 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/games')}
              >
                <Gamepad2 className="w-8 h-8 text-secondary mb-2" />
                <h3 className="font-semibold">Games</h3>
                <p className="text-xs text-muted-foreground">Play solo or with AI</p>
              </GlassPanel>

              <GlassPanel className="p-5">
                <Users className="w-8 h-8 text-accent mb-2" />
                <h3 className="font-semibold">{onlineUsers.length} Online</h3>
                <p className="text-xs text-muted-foreground">Available to chat</p>
              </GlassPanel>
            </div>
          </div>

          {/* Online Users */}
          <GlassPanel className="p-6 h-fit">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Available Now
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {onlineUsers.length > 0 ? (
                onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleConnectToUser(user.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <UserAvatar user={user} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.country}</p>
                    </div>
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No users online</p>
                  <NeonButton
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate('/games')}
                  >
                    Play with AI
                  </NeonButton>
                </div>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
