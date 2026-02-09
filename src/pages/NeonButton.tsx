import React from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NeonButton: React.FC<NeonButtonProps> = ({ className, children, ...props }) => {
  return (
    <button className={cn("bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon transition-all rounded-lg", className)} {...props}>
      {children}
    </button>
  );
};