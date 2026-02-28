import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export const Chat = ({ roomId, userName, isDark }: { roomId: string; userName: string; isDark?: boolean }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const dark = isDark ?? document.documentElement.classList.contains('dark');

    useEffect(() => {
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.emit('join-room', { roomId, userName, color: '#ffffff' });

        socket.on('chat-message-received', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId, userName]);

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;
        const newMsg = { roomId, message: input, userName };
        socketRef.current.emit('chat-message', newMsg);
        setInput('');
    };

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    return (
        <div
            style={{
                background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                borderColor: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
            }}
            className="flex flex-col h-[400px] w-80 p-4 rounded-2xl overflow-hidden shadow-xl border transition-colors"
        >
            <div
                style={{ borderBottomColor: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}
                className="flex items-center gap-2 mb-4 pb-3 border-b"
            >
                <div
                    style={{ background: dark ? 'rgba(99,102,241,0.2)' : '#eef2ff' }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                >
                    <MessageSquare size={16} style={{ color: dark ? '#818cf8' : '#4f46e5' }} />
                </div>
                <h3
                    style={{ color: dark ? 'rgba(255,255,255,0.9)' : '#1e293b' }}
                    className="font-bold tracking-wide text-sm"
                >
                    Team Chat
                </h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, i) => {
                        const isMe = msg.userName === userName;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <span
                                    style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}
                                    className="text-[9px] font-bold mb-1 px-1"
                                >
                                    {isMe ? 'You' : msg.userName}
                                </span>
                                <div
                                    style={isMe
                                        ? { background: dark ? '#4f46e5' : '#4f46e5', color: '#fff' }
                                        : {
                                            background: dark ? 'rgba(255,255,255,0.08)' : '#f8fafc',
                                            color: dark ? 'rgba(255,255,255,0.9)' : '#334155',
                                            borderColor: dark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                        }
                                    }
                                    className={`p-3 rounded-2xl max-w-[90%] text-sm shadow-sm border ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                                >
                                    <p className="leading-relaxed">{msg.message}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div
                style={{
                    background: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                    borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                }}
                className="mt-4 flex gap-2 items-center p-1.5 rounded-xl border transition-colors shadow-inner"
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                        color: dark ? '#ffffff' : '#334155',
                        caretColor: dark ? '#818cf8' : '#4f46e5',
                    }}
                    className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:font-medium placeholder:text-slate-400"
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-lg transition-all shadow-lg active:scale-95 flex-shrink-0"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};
