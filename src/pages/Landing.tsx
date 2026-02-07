import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Gamepad2, Users, Sparkles, Shield, Zap } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { TermsModal } from '@/components/modals/TermsModal';
import { useApp } from '@/context/AppContext';
import heroBg from '@/assets/hero-bg.jpg';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { termsAccepted, setTermsAccepted } = useApp();
  const [showTerms, setShowTerms] = useState(!termsAccepted);

  const features = [
    {
      icon: Video,
      title: 'HD Video Chat',
      description: 'Crystal clear video calls with strangers worldwide',
    },
    {
      icon: Gamepad2,
      title: '14+ Games',
      description: 'Play interactive games during video calls or solo',
    },
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Dynamic or preference-based user matching',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Moderated platform with report system',
    },
  ];

  const handleStart = () => {
    if (!termsAccepted) {
      setShowTerms(true);
    } else {
      navigate('/lobby');
    }
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <h1 className="text-3xl font-display font-bold text-gradient">VISHA</h1>
          <NeonButton variant="secondary" size="sm" onClick={() => navigate('/games')}>
            <Gamepad2 className="w-4 h-4" />
            Games
          </NeonButton>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Connect. Play. Have Fun.</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-foreground">Video Chat</span>
            <br />
            <span className="text-gradient">Reimagined</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Meet new people, play games together, and have meaningful conversations.
            The next generation of video chat is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeonButton size="lg" onClick={handleStart} className="min-w-[200px]">
              <Video className="w-5 h-5" />
              Start Chatting
            </NeonButton>
            <NeonButton variant="secondary" size="lg" onClick={() => navigate('/games')} className="min-w-[200px]">
              <Gamepad2 className="w-5 h-5" />
              Play Games
            </NeonButton>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <GlassPanel
              key={feature.title}
              className="p-8 animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="w-14 h-14 bg-gradient-neon rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </GlassPanel>
          ))}
        </section>

        {/* Stats */}
        <section className="text-center mb-12">
          <GlassPanel className="inline-flex gap-10 md:gap-20 px-10 lg:px-16 py-8">
            <div>
              <div className="text-3xl font-display font-bold text-gradient">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-gradient">14</div>
              <div className="text-sm text-muted-foreground">Games</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-gradient">190+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </GlassPanel>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/20 pt-8 mt-12 text-center text-muted-foreground text-sm">
          <p>© 2024 Visha. Connect responsibly.</p>
        </footer>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTerms}
        onAccept={handleAcceptTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  );
};

export default Landing;
