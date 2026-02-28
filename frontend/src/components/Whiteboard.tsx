import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Chat } from './Sidebar/Chat';
import { VideoCall } from './Sidebar/VideoCall';
import { ShareRoom } from './Sidebar/ShareRoom';
import { MiniGames } from './Sidebar/MiniGames';
import { UserList } from './presence/UserList';
import { useP2P } from '../hooks/useP2P';
import { Save, Loader2, Check } from 'lucide-react';

// We maintain a reference to the Excalidraw API to update the scene from Yjs
export function Whiteboard({ isDarkModeGlobal }: { isDarkModeGlobal: boolean }) {
    const { roomId } = useParams<{ roomId: string }>();
    const excalidrawAPI = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ydoc } = useP2P(`collaborative-whiteboard-${roomId || 'default'}`);

    const [guestName] = useState(`Guest ${Math.random().toString(36).substring(2, 6)}`);
    const [selectedColor] = useState('#' + Math.floor(Math.random() * 16777215).toString(16));

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(isDarkModeGlobal);

    useEffect(() => {
        setIsDarkMode(isDarkModeGlobal);
    }, [isDarkModeGlobal]);

    // Yjs shared map for elements
    const yElements = ydoc.getMap<any>('elements');

    const handleSaveSession = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:5001/api/sessions/${roomId}/save`, {
                method: 'PUT'
            });
            if (res.ok) {
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Failed to save session', err);
        } finally {
            setIsSaving(false);
        }
    };

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
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
            <div className="relative flex-1 board-container h-full">
                <Excalidraw
                    excalidrawAPI={(api) => excalidrawAPI.current = api}
                    onChange={onChange}
                    theme={isDarkMode ? 'dark' : 'light'}
                    initialData={{ appState: { theme: isDarkMode ? 'dark' : 'light' } }}
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

                {/* Custom top-left Action Bar overlay */}
                <div className="absolute top-4 left-[60px] z-[50]">
                    <button
                        onClick={handleSaveSession}
                        disabled={isSaved || isSaving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all border ${isSaved
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 cursor-default'
                            : 'bg-indigo-600/90 border-indigo-500 text-white hover:bg-indigo-600 hover:shadow-indigo-500/25'
                            } backdrop-blur-md`}
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : isSaved ? (
                            <Check size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{isSaving ? 'Saving...' : isSaved ? 'Saved to Projects' : 'Save Project'}</span>
                    </button>
                </div>
            </div>

            <div
                style={{
                    background: isDarkMode ? '#09090b' : '#ffffff',
                    borderLeftColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                }}
                className="w-80 h-full p-4 space-y-4 border-l z-[100] flex flex-col items-center overflow-y-auto custom-scrollbar shadow-2xl transition-colors duration-300"
            >
                <ShareRoom roomId={roomId || 'default'} isDark={isDarkMode} />
                <UserList roomId={roomId || 'default'} userName={guestName} color={selectedColor} isDark={isDarkMode} />
                <VideoCall roomId={roomId || 'default'} userName={guestName} isDark={isDarkMode} />
                <Chat roomId={roomId || 'default'} userName={guestName} isDark={isDarkMode} />
            </div>

            <MiniGames />
        </div>
    );
}
