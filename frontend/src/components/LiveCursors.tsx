import { useEffect, useState, Fragment } from 'react';
import { useAwareness } from '../hooks/useAwareness';
import { emojis } from '../utils/colors';

const CursorPointer = ({ color }: { color: string }) => (
    <svg className="cursor-pointer" viewBox="0 0 24 24" style={{ color }}>
        <path d="M5.65376 21.2052C5.2343 21.6247 4.5 21.3275 4.5 20.7342V4.46087C4.5 3.84439 5.26767 3.55835 5.67295 4.01777L18.4116 18.2562C18.8252 18.7203 18.4908 19.4609 17.8687 19.4609H12.9221C12.636 19.4609 12.3639 19.5828 12.1727 19.795L5.65376 21.2052Z" />
    </svg>
);

const EmojiParticleCluster = ({ x, y }: { x: number; y: number }) => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            angle: (i / 8) * Math.PI * 2,
            speed: 50 + Math.random() * 50,
            delay: Math.random() * 0.1,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <>
            <div className="ping-ripple" style={{ left: x, top: y }} />
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="emoji-particle"
                    style={{
                        left: x,
                        top: y,
                        animation: `blast 1s cubic-bezier(0.1, 0.8, 0.3, 1) ${p.delay}s forwards`,
                        '--tx': `${Math.cos(p.angle) * p.speed}px`,
                        '--ty': `${Math.sin(p.angle) * p.speed}px`,
                    } as any}
                >
                    {p.emoji}
                </div>
            ))}
            <style>{`
        @keyframes blast {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          50% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx) * 2), calc(-50% + var(--ty) * 2)) scale(0); opacity: 0; }
        }
      `}</style>
        </>
    );
};

export function LiveCursors() {
    const { states } = useAwareness();

    return (
        <div className="canvas-layer" style={{ zIndex: 100 }}>
            {Array.from(states.entries()).map(([clientId, state]) => {
                const { cursor, ping } = state;

                return (
                    <Fragment key={clientId}>
                        {cursor && (
                            <div
                                className="live-cursor"
                                style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
                            >
                                <CursorPointer color={cursor.color} />
                                <div className="cursor-name" style={{ backgroundColor: cursor.color }}>
                                    {cursor.name}
                                </div>
                            </div>
                        )}

                        {ping && (
                            <EmojiParticleCluster key={`ping-${ping.id}`} x={ping.x} y={ping.y} />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}
