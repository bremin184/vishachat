import React from 'react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

export const OnlineCountDisplay = () => {
  const count = useOnlineUsers();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>
      <span className="text-sm font-medium text-white/90">
        {count} Online
      </span>
    </div>
  );
};