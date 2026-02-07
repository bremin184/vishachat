import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Gamepad2,
  SkipForward,
  ChevronLeft,
  Send,
  X,
  Zap,
  Bot,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useApp } from '@/context/AppContext';
import { games } from '@/data/games';

const VideoChat: React.FC = () => {
  const navigate = useNavigate();
  const { odId } = useParams();
  const { videoState, setVideoState, connectedUser, setConnectedUser } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSearching, setIsSearching] = useState(!odId);
  const [showChat, setShowChat] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to access camera:', err);
      }
    };
    initCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulate matching
  useEffect(() => {
    if (odId) {
      const user = getUserById(odId);
      if (user) {
        setConnectedUser(user);
        setIsSearching(false);
        addSystemMessage(`Connected with ${user.name}!`);
      }
    } else if (isSearching) {
      const timer = setTimeout(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        setConnectedUser(randomUser);
        setIsSearching(false);
        addSystemMessage(`Connected with ${randomUser.name}!`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [odId, isSearching]);

  const addSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: 'system',
        text,
        timestamp: new Date(),
        type: 'system',
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: 'me',
        text: newMessage,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const responses = [
        'Hey there! 👋',
        'Nice to meet you!',
        'How are you doing?',
        'That\'s interesting!',
        'Cool, tell me more!',
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderId: connectedUser?.id || 'other',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text',
        },
      ]);
    }, 1500);
  };

  const handleSkip = () => {
    setConnectedUser(null);
    setMessages([]);
    setIsSearching(true);
    addSystemMessage('Searching for new match...');
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    navigate('/lobby');
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`h-screen bg-background flex flex-col lg:grid lg:gap-4 lg:p-4 overflow-hidden transition-all duration-300 ease-out ${
      showGames 
        ? 'lg:grid-cols-[30%_1fr_20rem]' 
        : 'lg:grid-cols-[1fr_20rem]'
    }`}>
      {/* Main Video Area */}
      <div className="flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 left-0 right-0 z-40 px-4 py-3 lg:px-6 lg:py-4 bg-background/50 backdrop-blur-sm border-b border-border/50 flex items-center justify-between">
          <button
            onClick={() => navigate('/lobby')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm text-sm hover:bg-background/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {connectedUser && (
            <GlassPanel className="px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-sm font-medium">{connectedUser.name}</span>
            </GlassPanel>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Remote Video / Searching State */}
        <div className="flex-1 relative bg-gradient-to-br from-muted to-card flex items-center justify-center">
          {isSearching ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-neon animate-pulse-glow flex items-center justify-center mb-6">
                <Video className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Finding Someone...</h2>
              <p className="text-muted-foreground">Please wait while we connect you</p>
              <div className="flex gap-1 mt-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : connectedUser ? (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <div className="text-center">
                <UserAvatar user={connectedUser} size="xl" showStatus={false} />
                <h3 className="mt-4 text-xl font-display font-semibold">{connectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{connectedUser.country}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Local Video Preview */}
        <div className={`absolute bottom-[6.5rem] right-4 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-neon-purple z-20 transition-all duration-300 ease-out ${
          showGames
            ? 'w-16 h-20 lg:w-28 lg:h-40 lg:bottom-[5.5rem] lg:right-6'
            : 'w-24 h-32 lg:w-40 lg:h-56 lg:bottom-[5.5rem] lg:right-6'
        }`}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
          />
          {isVideoOff && (
            <div className="w-full h-full bg-card flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-40 flex justify-center py-4 lg:py-6 bg-background/50 backdrop-blur-sm border-t border-border/50">
          <GlassPanel className="px-6 py-4 flex items-center gap-4">
            <button
              onClick={toggleMute}
              className={`control-btn ${isMuted ? 'active' : ''}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`control-btn ${showChat ? 'active' : ''}`}
            >
              <MessageSquare className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowGames(!showGames)}
              className={`control-btn ${showGames ? 'active' : ''}`}
            >
              <Gamepad2 className="w-6 h-6" />
            </button>

            {connectedUser && (
              <button onClick={handleSkip} className="control-btn">
                <SkipForward className="w-6 h-6" />
              </button>
            )}

            <button onClick={handleEndCall} className="control-btn danger">
              <PhoneOff className="w-6 h-6" />
            </button>
          </GlassPanel>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <GlassPanel className="w-full lg:w-full lg:h-[calc(100vh-7rem)] flex flex-col border-l border-border/30 lg:border-l-border/50 animate-slide-in-right transition-opacity duration-300 ease-out">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Chat
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${
                  msg.type === 'system'
                    ? 'text-center text-xs text-muted-foreground'
                    : `chat-bubble ${msg.senderId === 'me' ? 'sent' : 'received'}`
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:outline-none transition-colors"
              />
              <NeonButton onClick={handleSendMessage} className="px-4">
                <Send className="w-5 h-5" />
              </NeonButton>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Games Area */}
      {showGames && (
        <div className="w-full lg:w-auto flex flex-col overflow-hidden bg-gradient-to-br from-muted/20 to-card/50 border-l border-border/30 animate-slide-in-right transition-opacity duration-300 ease-out">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-display font-bold flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-secondary" />
              Games
            </h2>
            <button
              onClick={() => setShowGames(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 gap-3">
              {(connectedUser
                ? games
                : games.filter((g) => g.supportsAI)
              ).map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    navigate(`/games/${game.id}?ai=${connectedUser ? 'false' : 'true'}`);
                  }}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-primary/50 transition-all text-left group"
                >
                  <div className="text-2xl mb-1">{game.icon}</div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {game.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoChat;
