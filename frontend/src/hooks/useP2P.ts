import { useEffect, useMemo } from 'react';
import * as Y from 'yjs';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export const useP2P = (roomId: string) => {
    const ydoc = useMemo(() => new Y.Doc(), []);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        newSocket.emit('join-room', { roomId, userName: 'System-Yjs', color: '#000' });

        // Apply incoming Yjs updates
        newSocket.on('yjs-update', (updateBuffer: ArrayBuffer) => {
            Y.applyUpdate(ydoc, new Uint8Array(updateBuffer), 'socket');
        });

        // Broadcast local Yjs updates
        const handleUpdate = (update: Uint8Array, origin: any) => {
            if (origin !== 'socket') {
                newSocket.emit('yjs-update', { roomId, update });
            }
        };

        ydoc.on('update', handleUpdate);

        // State Synchronization for new peers
        newSocket.emit('request-yjs-state', roomId);

        newSocket.on('send-yjs-state', () => {
            // Convert local Yjs state to a massive update and broadcast it
            const stateVector = Y.encodeStateAsUpdate(ydoc);
            newSocket.emit('yjs-update', { roomId, update: stateVector });
        });

        return () => {
            ydoc.off('update', handleUpdate);
            newSocket.disconnect();
            ydoc.destroy();
        };
    }, [roomId, ydoc]);

    // Return a mock awareness to avoid breaking anything that still expects provider.awareness
    const mockAwareness = {
        setLocalStateField: () => { },
        getStates: () => new Map()
    };

    return { ydoc, provider: null, awareness: mockAwareness };
};

