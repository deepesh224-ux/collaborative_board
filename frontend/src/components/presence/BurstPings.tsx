import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAwareness } from '../../hooks/useAwareness';

export const BurstPings = () => {
    const { states } = useAwareness();
    const [pings, setPings] = useState<any[]>([]);

    useEffect(() => {
        const newPings: any[] = [];
        states.forEach((state, clientId) => {
            if (state.ping) {
                newPings.push({ ...state.ping, clientId });
            }
        });
        setPings(newPings);
    }, [states]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {pings.map((ping) => (
                    <motion.div
                        key={`${ping.clientId}-${ping.id}`}
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            left: ping.x,
                            top: ping.y,
                            width: 40,
                            height: 40,
                            marginLeft: -20,
                            marginTop: -20,
                            borderRadius: '50%',
                            border: `2px solid ${ping.color}`,
                            background: `radial-gradient(circle, ${ping.color}44 0%, transparent 70%)`
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
