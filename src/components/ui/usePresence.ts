import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket';

export type UserStatus = 'online' | 'searching' | 'in_call';
export type PresenceState = Record<string, { status: UserStatus }>;

export const usePresence = () => {
    const [presence, setPresence] = useState<PresenceState>({});

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleCurrentUsers = (users: PresenceState) => {
            setPresence(users);
        };

        const handleUserStatusUpdate = ({ socketId, status }: { socketId: string, status: UserStatus }) => {
            setPresence(prev => ({
                ...prev,
                [socketId]: { status },
            }));
        };
        
        const handleUserDisconnect = (socketId: string) => {
            setPresence(prev => {
                const newPresence = { ...prev };
                delete newPresence[socketId];
                return newPresence;
            });
        };

        socket.on('currentUsers', handleCurrentUsers);
        socket.on('userStatusUpdate', handleUserStatusUpdate);
        socket.on('userDisconnected', handleUserDisconnect);

        if (socket.connected) {
            socket.emit('getInitialPresence');
        } else {
            socket.once('connect', () => socket.emit('getInitialPresence'));
        }

        return () => {
            socket.off('currentUsers', handleCurrentUsers);
            socket.off('userStatusUpdate', handleUserStatusUpdate);
            socket.off('userDisconnected', handleUserDisconnect);
        };
    }, []);

    const getStatus = useCallback((socketId: string): UserStatus | undefined => {
        return presence[socketId]?.status;
    }, [presence]);

    return { presence, getStatus };
};