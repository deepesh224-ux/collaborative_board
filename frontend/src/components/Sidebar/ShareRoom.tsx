import { useState } from 'react';
import { Share2, Copy, Check, Link } from 'lucide-react';

export const ShareRoom = ({ roomId, isDark }: { roomId: string; isDark?: boolean }) => {
    const [copiedId, setCopiedId] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const fullUrl = `${window.location.origin}/room/${roomId}`;

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } catch (err) {
            console.error('Failed to copy ID', err);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        } catch (err) {
            console.error('Failed to copy Link', err);
        }
    };

    const dark = isDark ?? document.documentElement.classList.contains('dark');

    return (
        <div
            style={{
                background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderColor: dark ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
            }}
            className="w-full p-4 rounded-2xl flex flex-col gap-3 border shadow-xl transition-colors"
        >
            <div
                style={{ borderBottomColor: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}
                className="flex items-center gap-2 border-b pb-2"
            >
                <Share2 size={16} style={{ color: dark ? '#818cf8' : '#4f46e5' }} />
                <span
                    style={{ color: dark ? 'rgba(255,255,255,0.9)' : '#1e293b' }}
                    className="text-sm font-bold tracking-wide uppercase"
                >
                    Share Session
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <div
                    style={{
                        background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                        borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    }}
                    className="flex items-center justify-between border rounded-xl p-2 transition-colors"
                >
                    <div className="flex flex-col min-w-0 pr-2">
                        <span
                            style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}
                            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        >
                            Room ID
                        </span>
                        <span
                            style={{ color: dark ? 'rgba(255,255,255,0.9)' : '#1e293b' }}
                            className="text-xs font-mono truncate"
                        >
                            {roomId}
                        </span>
                    </div>
                    <button
                        onClick={handleCopyId}
                        style={{
                            background: copiedId
                                ? 'rgba(34,197,94,0.15)'
                                : dark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                            color: copiedId
                                ? '#22c55e'
                                : dark ? 'rgba(255,255,255,0.9)' : '#475569',
                        }}
                        className="p-2 rounded-lg transition-all flex-shrink-0"
                        title="Copy Room ID"
                    >
                        {copiedId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                <button
                    onClick={handleCopyLink}
                    style={{
                        background: copiedLink ? 'rgba(34,197,94,0.15)' : dark ? 'rgba(99,102,241,0.2)' : '#4f46e5',
                        borderColor: copiedLink ? 'rgba(34,197,94,0.4)' : dark ? 'rgba(99,102,241,0.4)' : '#4338ca',
                        color: copiedLink ? '#22c55e' : '#ffffff',
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm"
                >
                    {copiedLink ? (
                        <>
                            <Check size={16} />
                            <span>Link Copied!</span>
                        </>
                    ) : (
                        <>
                            <Link size={16} />
                            <span>Copy Full Link</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
