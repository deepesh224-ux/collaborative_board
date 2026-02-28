import { useEffect, useState, useCallback } from 'react';
import { awareness } from '../store/yjsSetup';
import type { Cursor, PingEvent } from '../types';

export interface AwarenessState {
    cursor?: Cursor;
    ping?: PingEvent;
}

export function useAwareness() {
    const [states, setStates] = useState<Map<number, AwarenessState>>(new Map());

    useEffect(() => {
        const updateStates = () => {
            const stateMap = new Map<number, AwarenessState>();
            awareness.getStates().forEach((state, clientId) => {
                if (clientId !== awareness.clientID) {
                    stateMap.set(clientId, state as AwarenessState);
                }
            });
            setStates(stateMap);
        };

        updateStates();
        awareness.on('change', updateStates);
        return () => {
            awareness.off('change', updateStates);
        };
    }, []);

    const updateCursor = useCallback((cursor: Cursor) => {
        awareness.setLocalStateField('cursor', cursor);
    }, []);

    const sendPing = useCallback((ping: PingEvent) => {
        awareness.setLocalStateField('ping', ping);

        // Clear ping after 2 seconds
        setTimeout(() => {
            awareness.setLocalStateField('ping', undefined);
        }, 2000);
    }, []);

    return {
        states,
        updateCursor,
        sendPing,
        clientId: awareness.clientID
    };
}
