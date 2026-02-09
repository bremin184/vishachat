import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';

export interface MatchResult {
  roomId: string;
  peerInfo: {
    socketId: string;
    deviceInfo: string;
  };
  isInitiator: boolean;
}

export const useMatchFinding = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);

  const findMatch = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    setIsSearching(true);
    setMatch(null);
    socket.emit('joinCall');
  }, []);

  const cancelSearch = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    setIsSearching(false);
    socket.emit('leaveQueue');
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onMatchFound = (data: MatchResult) => {
      setIsSearching(false);
      setMatch(data);
    };

    socket.on('matchFound', onMatchFound);

    return () => {
      socket.off('matchFound', onMatchFound);
    };
  }, []);

  return { findMatch, cancelSearch, isSearching, match };
};