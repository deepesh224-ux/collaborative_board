import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { getStore } from '../../store/yjsSetup';

export const UserList = ({ roomId, userName, color, isDark }: {
    roomId: string;
    userName: string;
    color: string;
    isDark?: boolean;
}) => {
    const [participants, setParticipants] = useState<any[]>([]);

    // Use unified socket from store
    const { socket } = getStore();

    const dark = isDark ?? document.documentElement.classList.contains('dark');

    useEffect(() => {
        // Emit join update for current user on the unified socket
        socket.emit('join-room', { roomId, userName, color });

        const handleUserJoined = (user: any) => {
            if (user.roomId === roomId || !user.roomId) { // Backend might not include roomId in broadcast if it's already in room
                setParticipants(prev => [...prev.filter(u => u.socketId !== user.socketId), user]);
            }
        };

        socket.on('user-joined', handleUserJoined);

        return () => {
            socket.off('user-joined', handleUserJoined);
        };
    }, [socket, roomId, userName, color]);

    return (
        <div
            style={{
                background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                borderColor: dark ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
            }}
            className="w-full px-4 py-3 rounded-2xl flex flex-col items-center gap-4 border transition-colors shadow-sm flex-shrink-0"
        >
            <div
                style={{ borderBottomColor: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}
                className="flex items-center gap-2 border-b w-full justify-center pb-2"
            >
                <Users size={18} style={{ color: dark ? '#818cf8' : '#4f46e5' }} />
                <span
                    style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#475569' }}
                    className="text-xs font-semibold uppercase tracking-wider"
                >
                    Collaborators
                </span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 w-full">
                <AnimatePresence>
                    {participants.map((user, i) => (
                        <motion.div
                            key={user.socketId || i}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, y: -20 }}
                            className="relative group"
                        >
                            <div
                                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                                style={{
                                    backgroundColor: user.color,
                                    borderColor: dark ? '#09090b' : '#ffffff',
                                }}
                            >
                                {user.userName.slice(0, 2).toUpperCase()}
                            </div>
                            <div
                                style={{ background: dark ? 'rgba(0,0,0,0.8)' : '#1e293b' }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
                            >
                                {user.userName}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Always show current user */}
                <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white shadow-lg z-10"
                    style={{
                        backgroundColor: color,
                        borderColor: dark ? '#09090b' : '#ffffff',
                    }}
                    title="You"
                >
                    ME
                </div>
            </div>
        </div>
    );
};
