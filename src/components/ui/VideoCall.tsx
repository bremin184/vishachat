import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { MatchResult } from '@/hooks/useMatchFinding';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  match: MatchResult;
  localStream: MediaStream | null;
  onEndCall?: () => void;
  onPeerDisconnect?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ match, localStream, onEndCall, onPeerDisconnect }) => {
  const { remoteStream } = useWebRTC(match.roomId, localStream, match.isInitiator, onPeerDisconnect);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black rounded-xl overflow-hidden">
      {/* Remote Video (Full Size) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {!remoteStream && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          <p>Connecting to peer...</p>
        </div>
      )}

      {/* Local Video (Picture in Picture) */}
      <Card className={cn("absolute bottom-4 right-4 w-32 h-48 overflow-hidden border-2 border-white/20 shadow-lg bg-black/50 backdrop-blur-sm")}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
        />
      </Card>
    </div>
  );
};