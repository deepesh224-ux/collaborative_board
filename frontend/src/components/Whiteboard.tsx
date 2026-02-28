import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Chat } from './Sidebar/Chat';
import { VideoCall } from './Sidebar/VideoCall';
import { MiniGames } from './Sidebar/MiniGames';
import { UserList } from './presence/UserList';
import { useP2P } from '../hooks/useP2P';

// We maintain a reference to the Excalidraw API to update the scene from Yjs
export function Whiteboard() {
    const { roomId } = useParams<{ roomId: string }>();
    const excalidrawAPI = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ydoc } = useP2P(`collaborative-whiteboard-${roomId || 'default'}`);

    const [guestName] = useState(`Guest ${Math.random().toString(36).substring(2, 6)}`);
    const [selectedColor] = useState('#' + Math.floor(Math.random() * 16777215).toString(16));

    // Yjs shared map for elements
    const yElements = ydoc.getMap<any>('elements');

    // Sync from Yjs to Excalidraw
    useEffect(() => {
        const handleSync = () => {
            if (!excalidrawAPI.current) return;

            // Map Yjs map to array for Excalidraw
            const yArray = Array.from(yElements.values());

            // basic reconciliation (for a production app, use actual CRDT merging strategies)
            if (yArray.length > 0) {
                excalidrawAPI.current.updateScene({ elements: yArray });
            }
        };

        yElements.observe(handleSync);
        return () => yElements.unobserve(handleSync);
    }, [yElements]);


    const onChange = useCallback((elements: readonly any[]) => {
        ydoc.transact(() => {
            elements.forEach(el => {
                // To prevent infinite loops, only update if the version changed or it's new
                const existing = yElements.get(el.id);
                if (!existing || existing.version < el.version) {
                    yElements.set(el.id, el);
                }
            });
        });
    }, [yElements, ydoc]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0f1115]">
            <div className="relative flex-1 board-container h-full">
                <Excalidraw
                    excalidrawAPI={(api) => excalidrawAPI.current = api}
                    onChange={onChange}
                    initialData={{ appState: { theme: 'dark' } }}
                    UIOptions={{
                        canvasActions: {
                            changeViewBackgroundColor: true,
                            clearCanvas: true,
                            export: { saveFileToDisk: true },
                            loadScene: true,
                            saveToActiveFile: true,
                            toggleTheme: true,
                            saveAsImage: true,
                        }
                    }}
                />
            </div>

            {/* Glassmorphic Sidebar flex item */}
            <div className="w-80 h-full p-4 space-y-4 glass-panel border-l border-white/10 z-[100] flex flex-col items-center overflow-y-auto custom-scrollbar shadow-2xl bg-black/40 backdrop-blur-xl">
                <UserList roomId={roomId || 'default'} userName={guestName} color={selectedColor} />
                <VideoCall />
                <Chat roomId={roomId || 'default'} userName={guestName} />
            </div>

            <MiniGames />
        </div>
    );
}
