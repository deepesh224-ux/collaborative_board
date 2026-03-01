import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Chat } from './Sidebar/Chat';
import { VideoCall } from './Sidebar/VideoCall';
import { ShareRoom } from './Sidebar/ShareRoom';
import { MiniGames } from './Sidebar/MiniGames';
import { UserList } from './presence/UserList';
import { Save, Loader2, Check, ArrowLeft } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getStore } from '../store/yjsSetup';

// We maintain a reference to the Excalidraw API to update the scene from Socket
export function Whiteboard({ isDarkModeGlobal }: { isDarkModeGlobal: boolean }) {
    const { user, token } = useAuth();
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const excalidrawAPI = useRef<any>(null);

    // Stable reference to Socket.IO store
    const store = getStore();
    const { socket } = store;

    const [guestName] = useState(user?.name || `Guest ${Math.random().toString(36).substring(2, 6)}`);
    const [selectedColor] = useState('#' + Math.floor(Math.random() * 16777215).toString(16));

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(isDarkModeGlobal);

    // Track versions locally to efficiently sync only exact deltas
    const isUpdatingRemote = useRef(false);
    const localElementsCache = useRef(new Map<string, number>());

    useEffect(() => {
        setIsDarkMode(isDarkModeGlobal);
    }, [isDarkModeGlobal]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleSaveSession = async () => {
        if (!token) return;
        setIsSaving(true);
        try {
            // Snapshot current whiteboard elements
            const elements = excalidrawAPI.current?.getSceneElements() || [];

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/sessions/${roomId}/save`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: elements }),
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

    // Load saved whiteboard data from DB on mount (restores across sessions)
    useEffect(() => {
        if (!token || !roomId) return;
        fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/sessions/${roomId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(board => {
                if (board?.data && Array.isArray(board.data) && board.data.length > 0) {
                    if (excalidrawAPI.current) {
                        isUpdatingRemote.current = true;
                        excalidrawAPI.current.updateScene({ elements: board.data });
                        isUpdatingRemote.current = false;

                        // Seed cache to distinguish future local changes
                        board.data.forEach((el: any) => localElementsCache.current.set(el.id, el.version));
                    }
                }
            })
            .catch(() => { }); // silently ignore if board not found
    }, [roomId, token]);

    // Apply incremental INCOMING peer elements -> Excalidraw canvas securely
    useEffect(() => {
        if (!socket) return;

        const handleDrawElements = (incomingElements: any[]) => {
            if (!excalidrawAPI.current) return;
            const currentElements = excalidrawAPI.current.getSceneElements();
            const elementsMap = new Map(currentElements.map((el: any) => [el.id, el]));

            let updated = false;
            incomingElements.forEach((incoming: any) => {
                const existing: any = elementsMap.get(incoming.id);
                // Safe conflict resolution: apply only strictly newer variants
                if (!existing || incoming.version > existing.version) {
                    elementsMap.set(incoming.id, incoming);
                    // Update cache to avoid mistakenly sending it back repeatedly
                    localElementsCache.current.set(incoming.id, incoming.version);
                    updated = true;
                }
            });

            if (updated) {
                isUpdatingRemote.current = true;
                excalidrawAPI.current.updateScene({ elements: Array.from(elementsMap.values()) });
                isUpdatingRemote.current = false;
            }
        };

        const handleRequestState = (targetSocketId: string) => {
            if (!excalidrawAPI.current) return;
            const elements = excalidrawAPI.current.getSceneElements();
            if (elements.length > 0) {
                socket.emit('send-full-state', { target: targetSocketId, elements });
            }
        };

        const handleFullState = (elements: any[]) => {
            if (!excalidrawAPI.current) return;
            isUpdatingRemote.current = true;
            excalidrawAPI.current.updateScene({ elements });
            isUpdatingRemote.current = false;

            elements.forEach((el: any) => localElementsCache.current.set(el.id, el.version));
        };

        socket.on('draw-elements', handleDrawElements);
        socket.on('request-full-state', handleRequestState);
        socket.on('full-state', handleFullState);

        // Tell the room we just arrived and need current state
        socket.emit('request-board-state', roomId);

        return () => {
            socket.off('draw-elements', handleDrawElements);
            socket.off('request-full-state', handleRequestState);
            socket.off('full-state', handleFullState);
        };
    }, [socket, roomId]);

    // Identify LOCAL incremental changes -> Broadcast OUT to peers
    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Sync theme change
        if (appState.theme !== (isDarkMode ? 'dark' : 'light')) {
            setIsDarkMode(appState.theme === 'dark');
        }

        // Extremely critical guard: Skip processing if we are drawing purely remote data
        if (isUpdatingRemote.current) return;

        const changedElements = elements.filter(el => {
            const lastVersion = localElementsCache.current.get(el.id) || 0;
            if (el.version > lastVersion) {
                localElementsCache.current.set(el.id, el.version);
                return true;
            }
            return false;
        });

        if (changedElements.length > 0) {
            socket.emit('draw-elements', { roomId, elements: changedElements });
            setIsSaved(false); // Map modified so unsaved changes exist
        }
    }, [roomId, socket, isDarkMode]);

    const onPointerUpdate = useCallback((payload: any) => {
        if (!socket) return;
        socket.emit('cursor-move', {
            roomId,
            x: payload.pointer.x,
            y: payload.pointer.y,
            userName: guestName,
            color: selectedColor
        });
    }, [roomId, socket, guestName, selectedColor]);

    // Use MutationObserver to hide Mermaid item and ? button whenever they appear in the DOM
    useEffect(() => {
        const hideMermaidAndHelp = () => {
            document.querySelectorAll('.excalidraw li, .excalidraw button, .excalidraw .dropdown-menu-item').forEach((el) => {
                const text = el.textContent?.trim() ?? '';
                if (text.toLowerCase().includes('mermaid')) {
                    (el as HTMLElement).style.display = 'none';
                }
            });
            document.querySelectorAll('.excalidraw .dropdown-menu-group-title, .excalidraw .Island > *').forEach((el) => {
                if ((el as HTMLElement).textContent?.trim() === 'Generate') {
                    (el as HTMLElement).style.display = 'none';
                }
            });
            document.querySelectorAll<HTMLElement>(
                '.excalidraw .help-icon, .excalidraw [aria-label="Help"], .excalidraw [data-testid="help-button"], .excalidraw button[title="Help"]'
            ).forEach(el => { el.style.display = 'none'; });
        };

        const observer = new MutationObserver(hideMermaidAndHelp);
        observer.observe(document.body, { childList: true, subtree: true });
        hideMermaidAndHelp(); // run once immediately
        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
            <div className="relative flex-1 board-container h-full">
                <Excalidraw
                    excalidrawAPI={(api) => excalidrawAPI.current = api}
                    onChange={onChange}
                    onPointerUpdate={onPointerUpdate}
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
                <div className="absolute top-4 left-[60px] z-[50] flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all border bg-white/90 dark:bg-zinc-800/90 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700/80 backdrop-blur-md"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>

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
