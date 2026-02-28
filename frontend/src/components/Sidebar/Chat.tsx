import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { getStore } from '../../store/yjsSetup';

export const Chat = ({ roomId, userName }: { roomId: string, userName: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // In a real app, you'd use a Yjs Array or Map for chat persistence
    // For this demo, we'll use a simple Socket.io broadcast (implemented in backend index.ts)

    const sendMessage = () => {
        if (!input.trim()) return;
        // Emit to socket (assuming socket is globally available or passed in)
        // For now, let's use the awareness/Yjs for "state synced" chat
        const { ydoc } = getStore();
        const yChat = ydoc.getArray('chat-messages');
        yChat.push([{ text: input, user: userName, timestamp: Date.now() }]);
        setInput('');
    };

    useEffect(() => {
        const { ydoc } = getStore();
        const yChat = ydoc.getArray('chat-messages');
        const updateMessages = () => setMessages(yChat.toArray());
        yChat.observe(updateMessages);
        updateMessages();
        return () => yChat.unobserve(updateMessages);
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    return (
        <div className="glass-panel flex flex-col h-[400px] w-80 p-4 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <MessageSquare size={20} className="text-blue-400" />
                <h3 className="font-semibold text-white/90">Team Chat</h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-2 rounded-xl text-sm ${msg.user === userName ? 'bg-blue-500/20 ml-4 border border-blue-500/30' : 'bg-white/5 mr-4 border border-white/10'}`}
                        >
                            <span className="block text-[10px] opacity-50 mb-1">{msg.user}</span>
                            <p className="text-white/80">{msg.text}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
