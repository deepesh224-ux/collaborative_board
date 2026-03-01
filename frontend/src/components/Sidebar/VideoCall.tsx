import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const VideoCall = ({ roomId, userName, isDark }: {
    roomId: string;
    userName: string;
    isDark?: boolean;
}) => {
    const [isActive, setIsActive] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const dark = isDark ?? document.documentElement.classList.contains('dark');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    };

    useEffect(() => {
        if (!isActive) return;

        const initWebRTC = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                socketRef.current = io(SOCKET_URL);
                const socket = socketRef.current;

                socket.emit('join-room', { roomId, userName, color: '#ffffff' });

                socket.on('user-joined', async (user) => {
                    const pc = createPeerConnection(user.socketId);
                    peerConnectionRef.current = pc;
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc-offer', { target: user.socketId, caller: socket.id, sdp: offer });
                });

                socket.on('webrtc-offer', async ({ caller, sdp }) => {
                    const pc = createPeerConnection(caller);
                    peerConnectionRef.current = pc;
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('webrtc-answer', { target: caller, caller: socket.id, sdp: answer });
                });

                socket.on('webrtc-answer', async ({ sdp }) => {
                    const pc = peerConnectionRef.current;
                    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                });

                socket.on('webrtc-ice-candidate', async ({ candidate }) => {
                    const pc = peerConnectionRef.current;
                    if (pc) {
                        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { }
                    }
                });

            } catch (err) {
                console.error("Error accessing media devices.", err);
                setIsActive(false);
            }
        };

        const createPeerConnection = (targetSocketId: string) => {
            const pc = new RTCPeerConnection(iceServers);
            pc.onicecandidate = (event) => {
                if (event.candidate && socketRef.current) {
                    socketRef.current.emit('webrtc-ice-candidate', { target: targetSocketId, candidate: event.candidate });
                }
            };
            pc.ontrack = (event) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    if (localStreamRef.current) pc.addTrack(track, localStreamRef.current);
                });
            }
            return pc;
        };

        initWebRTC();

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerConnectionRef.current?.close();
            socketRef.current?.disconnect();
        };
    }, [isActive, roomId, userName]);

    const toggleLocalVideo = () => {
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; setIsVideoOn(videoTrack.enabled); }
    };

    const toggleLocalAudio = () => {
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsMicOn(audioTrack.enabled); }
    };

    const stopCall = () => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnectionRef.current?.close();
        socketRef.current?.disconnect();
        setIsActive(false);
    };

    const cardStyle = {
        background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        borderColor: dark ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
    };

    if (!isActive) {
        return (
            <button
                onClick={() => setIsActive(true)}
                style={cardStyle}
                className="w-full p-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border shadow-sm flex-shrink-0"
            >
                <Video size={18} style={{ color: dark ? '#4ade80' : '#16a34a' }} />
                <span style={{ color: dark ? '#ffffff' : '#334155' }} className="font-medium text-sm">
                    Join Video Call
                </span>
            </button>
        );
    }

    return (
        <div style={cardStyle} className="w-80 p-4 rounded-2xl space-y-4 shadow-xl border transition-colors flex-shrink-0">
            {/* Local Video */}
            <div
                style={{ background: dark ? 'rgba(0,0,0,0.6)' : '#f1f5f9', borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}
                className="relative aspect-video rounded-xl overflow-hidden border shadow-inner"
            >
                <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`} />
                {!isVideoOn && (
                    <div style={{ background: dark ? '#18181b' : '#f1f5f9' }} className="absolute inset-0 flex items-center justify-center">
                        <VideoOff size={32} style={{ color: dark ? 'rgba(255,255,255,0.2)' : '#94a3b8' }} />
                    </div>
                )}
                <div
                    style={{ background: dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', color: dark ? '#fff' : '#334155' }}
                    className="absolute bottom-2 left-2 px-2 py-1 backdrop-blur-md rounded-lg text-[10px] font-medium"
                >
                    You
                </div>
            </div>

            {/* Remote Video */}
            <div
                style={{ background: dark ? 'rgba(0,0,0,0.6)' : '#f1f5f9', borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}
                className="relative aspect-video rounded-xl overflow-hidden border shadow-inner"
            >
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <span style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} className="text-[10px] font-medium">
                        Waiting for participant...
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div
                style={{ background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderColor: dark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}
                className="flex justify-center gap-4 p-2 rounded-xl border shadow-inner transition-colors"
            >
                <button
                    onClick={toggleLocalAudio}
                    style={{
                        background: isMicOn ? (dark ? 'rgba(255,255,255,0.1)' : '#ffffff') : (dark ? 'rgba(239,68,68,0.2)' : '#fef2f2'),
                        color: isMicOn ? (dark ? '#ffffff' : '#475569') : '#dc2626',
                        borderColor: dark ? 'transparent' : (isMicOn ? '#e2e8f0' : '#fca5a5'),
                    }}
                    className="p-3 rounded-xl transition-all border"
                >
                    {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                    onClick={toggleLocalVideo}
                    style={{
                        background: isVideoOn ? (dark ? 'rgba(255,255,255,0.1)' : '#ffffff') : (dark ? 'rgba(239,68,68,0.2)' : '#fef2f2'),
                        color: isVideoOn ? (dark ? '#ffffff' : '#475569') : '#dc2626',
                        borderColor: dark ? 'transparent' : (isVideoOn ? '#e2e8f0' : '#fca5a5'),
                    }}
                    className="p-3 rounded-xl transition-all border"
                >
                    {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
                <button onClick={stopCall} className="p-3 rounded-xl transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg ml-2">
                    <PhoneOff size={18} />
                </button>
            </div>
        </div>
    );
};
