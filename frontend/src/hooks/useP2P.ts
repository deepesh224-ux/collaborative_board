import { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const useP2P = (roomId: string) => {
    const ydoc = useMemo(() => new Y.Doc(), []);
    const [provider, setProvider] = useState<WebrtcProvider | null>(null);

    useEffect(() => {
        const newProvider = new WebrtcProvider(roomId, ydoc, {
            signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
        });

        setProvider(newProvider);

        return () => {
            newProvider.destroy();
            ydoc.destroy();
        };
    }, [roomId, ydoc]);

    return { ydoc, provider, awareness: provider?.awareness };
};
