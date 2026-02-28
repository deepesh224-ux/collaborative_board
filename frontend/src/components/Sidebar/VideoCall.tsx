import { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';

export const VideoCall = () => {
    const [isActive, setIsActive] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    if (!isActive) {
        return (
            <button
                onClick={() => setIsActive(true)}
                className="glass-panel w-full p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/20"
            >
                <Video size={20} className="text-green-400" />
                <span className="text-white font-medium">Start Video Call</span>
            </button>
        );
    }

    return (
        <div className="glass-panel w-80 p-4 rounded-2xl space-y-4">
            <div className="relative aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                    {isVideoOn ?
                        <div className="w-full h-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse" />
                        : <VideoOff size={32} className="text-white/20" />
                    }
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] text-white">
                    You (Collaborator)
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {/* Placeholder for other remote videos */}
                <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/30">John Doe</span>
                </div>
                <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/30">Jane Smith</span>
                </div>
            </div>

            <div className="flex justify-center gap-3">
                <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-2 rounded-full transition-colors ${isMicOn ? 'bg-white/10' : 'bg-red-500/20 text-red-400'}`}
                >
                    {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2 rounded-full transition-colors ${isVideoOn ? 'bg-white/10' : 'bg-red-500/20 text-red-400'}`}
                >
                    {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
                <button
                    onClick={() => setIsActive(false)}
                    className="p-2 rounded-full bg-red-500 text-white transition-colors"
                >
                    <PhoneOff size={18} />
                </button>
            </div>
        </div>
    );
};
