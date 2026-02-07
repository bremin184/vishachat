import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { Home, Zap } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-destructive/20 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4">
        <div className="w-20 h-20 bg-gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-8xl font-display font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <NeonButton>
            <Home className="w-5 h-5" />
            Back to Home
          </NeonButton>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
