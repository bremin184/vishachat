import React from 'react';
import { cn } from '@/lib/utils';
import { Video, Search, CircleDot } from 'lucide-react';
import { UserStatus } from '@/hooks/usePresence';

interface PresenceBadgeProps {
  status?: UserStatus;
  className?: string;
}

const statusConfig: Record<UserStatus, { label: string; icon: React.ElementType; className: string }> = {
    in_call: {
        label: 'In Call',
        icon: Video,
        className: 'bg-red-500/90 border-red-500/20 text-white',
    },
    searching: {
        label: 'Searching',
        icon: Search,
        className: 'bg-blue-500/90 border-blue-500/20 text-white animate-pulse',
    },
    online: {
        label: 'Online',
        icon: CircleDot,
        className: 'bg-green-500/90 border-green-500/20 text-white',
    },
};

export const PresenceBadge: React.FC<PresenceBadgeProps> = ({ status = 'online', className }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border", config.className, className)}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
        </div>
    );
};