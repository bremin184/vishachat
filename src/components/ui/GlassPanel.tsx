import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noBorder?: boolean;
  glow?: 'purple' | 'cyan' | 'pink' | 'none';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, noBorder, glow = 'none', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass-panel',
          glow === 'purple' && 'shadow-neon-purple',
          glow === 'cyan' && 'shadow-neon-cyan',
          glow === 'pink' && 'shadow-neon-pink',
          noBorder && 'border-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
