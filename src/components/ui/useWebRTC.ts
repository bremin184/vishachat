import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (roomId: string, localStream: MediaStream | null, isInitiator: boolean, onPeerDisconnect?: () => void) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !localStream) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnection.current = pc;

    // Add local tracks to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    // Socket event listeners
    const handleReceiveOffer = async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (isInitiator) return; // Initiator shouldn't receive offers in this flow
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, sdp: answer });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    const handleReceiveAnswer = async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (!isInitiator) return; // Non-initiator shouldn't receive answers
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    };

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ice candidate:', err);
      }
    };

    const handlePeerDisconnected = () => {
      if (onPeerDisconnect) onPeerDisconnect();
      setRemoteStream(null);
    };

    socket.on('receiveOffer', handleReceiveOffer);
    socket.on('receiveAnswer', handleReceiveAnswer);
    socket.on('iceCandidate', handleIceCandidate);
    socket.on('peerDisconnected', handlePeerDisconnected);

    // Initiate call if we are the initiator
    if (isInitiator) {
      const createOffer = async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { roomId, sdp: offer });
        } catch (err) {
          console.error('Error creating offer:', err);
        }
      };
      createOffer();
    }

    return () => {
      socket.off('receiveOffer', handleReceiveOffer);
      socket.off('receiveAnswer', handleReceiveAnswer);
      socket.off('iceCandidate', handleIceCandidate);
      socket.off('peerDisconnected', handlePeerDisconnected);
      pc.close();
      peerConnection.current = null;
    };
  }, [roomId, localStream, isInitiator, onPeerDisconnect]);

  return { remoteStream, connectionState };
};