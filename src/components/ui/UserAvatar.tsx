import React from 'react';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = true,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const statusColors = {
    online: 'bg-neon-green',
    busy: 'bg-neon-orange',
    away: 'bg-muted-foreground',
  };

  const statusSizes = {
    sm: 'w-2 h-2 border',
    md: 'w-3 h-3 border-2',
    lg: 'w-4 h-4 border-2',
    xl: 'w-5 h-5 border-2',
  };

  return (
    <div className={cn('relative', sizes[size])}>
      <img
        src={user.avatar}
        alt={user.name}
        className={cn(
          'rounded-full object-cover ring-2 ring-primary/50',
          sizes[size]
        )}
      />
      {showStatus && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            statusColors[user.status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
