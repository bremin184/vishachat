import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassPanel: React.FC<GlassPanelProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("bg-white/10 backdrop-blur-md border border-white/20 rounded-xl", className)} {...props}>
      {children}
    </div>
  );
};