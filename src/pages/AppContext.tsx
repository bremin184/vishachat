import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  country: string;
  interests: string[];
}

interface AppContextType {
  videoState: any;
  setVideoState: (state: any) => void;
  connectedUser: User | null;
  setConnectedUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videoState, setVideoState] = useState({});
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ videoState, setVideoState, connectedUser, setConnectedUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};