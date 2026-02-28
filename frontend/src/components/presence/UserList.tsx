import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export const UserList = ({ roomId, userName, color }: { roomId: string, userName: string, color: string }) => {
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        newSocket.emit('join-room', { roomId, userName, color });

        newSocket.on('user-joined', (user) => {
            setParticipants(prev => [...prev.filter(u => u.socketId !== user.socketId), user]);
        });

        // In a real app, you'd handle 'user-left' and initial list syncing
        // For this demo, we'll keep it simple

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, userName, color]);

    return (
        <div className="glass-panel w-full px-4 py-3 rounded-2xl flex flex-col items-center gap-4 border border-white/20">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 w-full justify-center">
                <Users size={18} className="text-blue-400" />
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Collaborators</span>
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
                                className="w-8 h-8 rounded-full border-2 border-[#0f1115] flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                                style={{ backgroundColor: user.color }}
                            >
                                {user.userName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {user.userName}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Always show current user */}
                <div
                    className="w-8 h-8 rounded-full border-2 border-[#0f1115] flex items-center justify-center text-[10px] font-bold text-white shadow-lg z-10"
                    style={{ backgroundColor: color }}
                >
                    ME
                </div>
            </div>
        </div>
    );
};
