import React from 'react';
import { X, Shield, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, onClose }) => {
  if (!isOpen) return null;

  const terms = [
    {
      icon: Shield,
      title: 'Be Respectful',
      description: 'Treat others with kindness. No harassment, hate speech, or bullying.',
    },
    {
      icon: Eye,
      title: 'Keep It Safe',
      description: 'No explicit content. This is a moderated platform.',
    },
    {
      icon: MessageSquare,
      title: 'Real Connections',
      description: 'Be authentic. No spam, scams, or misleading behavior.',
    },
    {
      icon: AlertTriangle,
      title: 'Report Issues',
      description: 'Help keep the community safe by reporting violations.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-lg p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gradient">Welcome to Visha</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground mb-6">
          Before you start, please agree to our community guidelines to ensure a safe
          and enjoyable experience for everyone.
        </p>

        <div className="space-y-4 mb-8">
          {terms.map((term) => (
            <div key={term.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <term.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{term.title}</h3>
                <p className="text-xs text-muted-foreground">{term.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <NeonButton onClick={onAccept} className="flex-1">
            I Agree & Continue
          </NeonButton>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By clicking "I Agree", you accept our Terms of Service and Privacy Policy.
        </p>
      </GlassPanel>
    </div>
  );
};
