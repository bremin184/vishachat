import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

export const useOnlineUsers = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCountUpdate = (newCount: number) => {
      setCount(newCount);
    };

    socket.on('onlineUsersCount', handleCountUpdate);

    return () => {
      socket.off('onlineUsersCount', handleCountUpdate);
    };
  }, []);

  return count;
};