import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, MatchPreferences, VideoState, GameState, Game } from '@/types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  matchPreferences: MatchPreferences;
  setMatchPreferences: (prefs: MatchPreferences) => void;
  videoState: VideoState;
  setVideoState: (state: VideoState) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  connectedUser: User | null;
  setConnectedUser: (user: User | null) => void;
}

const defaultContext: AppContextType = {
  user: null,
  setUser: () => {},
  matchPreferences: { mode: 'dynamic' },
  setMatchPreferences: () => {},
  videoState: {
    isMuted: false,
    isVideoOff: false,
    isConnected: false,
    isSearching: false,
  },
  setVideoState: () => {},
  gameState: {
    currentGame: null,
    isPlaying: false,
    opponent: null,
    score: { player: 0, opponent: 0 },
  },
  setGameState: () => {},
  termsAccepted: false,
  setTermsAccepted: () => {},
  connectedUser: null,
  setConnectedUser: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [matchPreferences, setMatchPreferences] = useState<MatchPreferences>({
    mode: 'dynamic',
  });
  const [videoState, setVideoState] = useState<VideoState>({
    isMuted: false,
    isVideoOff: false,
    isConnected: false,
    isSearching: false,
  });
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    isPlaying: false,
    opponent: null,
    score: { player: 0, opponent: 0 },
  });
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return localStorage.getItem('visha_terms_accepted') === 'true';
  });
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  const handleSetTermsAccepted = (accepted: boolean) => {
    setTermsAccepted(accepted);
    localStorage.setItem('visha_terms_accepted', String(accepted));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        matchPreferences,
        setMatchPreferences,
        videoState,
        setVideoState,
        gameState,
        setGameState,
        termsAccepted,
        setTermsAccepted: handleSetTermsAccepted,
        connectedUser,
        setConnectedUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
