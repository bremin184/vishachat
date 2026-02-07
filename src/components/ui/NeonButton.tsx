import React from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', isLoading, disabled, ...props }, ref) => {
    const baseStyles = 'relative font-semibold rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center gap-2';
    
    const variants = {
      primary: 'btn-neon text-white',
      secondary: 'btn-neon-secondary',
      danger: 'bg-destructive text-white hover:shadow-[0_0_20px_hsl(var(--destructive)/0.6)]',
      ghost: 'bg-transparent hover:bg-muted text-foreground',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="spinner w-5 h-5" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

NeonButton.displayName = 'NeonButton';
