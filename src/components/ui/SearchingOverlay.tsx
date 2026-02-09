import React from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface SearchingOverlayProps {
  onCancel: () => void;
}

export const SearchingOverlay: React.FC<SearchingOverlayProps> = ({ onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <GlassPanel className="flex flex-col items-center p-8 max-w-sm mx-4 text-center space-y-6 border-primary/20 shadow-neon-purple">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative bg-background rounded-full p-4 border-2 border-primary">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display">Finding a Match...</h3>
          <p className="text-muted-foreground text-sm">Looking for someone to chat with.</p>
        </div>

        <Button variant="outline" onClick={onCancel} className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
          <X className="w-4 h-4" />
          Cancel Search
        </Button>
      </GlassPanel>
    </div>
  );
};