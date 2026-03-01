import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './lib/prisma';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionRoutes from './routes/session';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/user', userRoutes);

// Socket.io Presence and Collaboration
const roomsData: Record<string, any> = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', async ({ roomId, userName, color, userId }) => {
        socket.join(roomId);

        // Track user in room
        if (!roomsData[roomId]) roomsData[roomId] = [];
        if (!roomsData[roomId].includes(socket.id)) {
            roomsData[roomId].push(socket.id);
        }

        // Notify others about the new participant
        socket.to(roomId).emit('user-joined', { socketId: socket.id, userName, color });

        // Persist the user as a collaborator on this board (for Shared page)
        // Only add if they are a real authenticated user and not the owner
        if (userId) {
            try {
                const board = await prisma.board.findUnique({ where: { id: roomId } });
                if (board && board.ownerId !== userId) {
                    await prisma.board.update({
                        where: { id: roomId },
                        data: {
                            collaborators: {
                                connect: { id: userId },
                            },
                        },
                    });
                }
            } catch (err) {
                // Board might not exist yet or user already connected — ignore silently
            }
        }

        // Send saved chat history to the newly joined user
        try {
            const history = await prisma.chatMessage.findMany({
                where: { boardId: roomId },
                orderBy: { createdAt: 'asc' },
                take: 100,
            });
            if (history.length > 0) {
                socket.emit('chat-history', history.map(m => ({
                    roomId: m.boardId,
                    userName: m.userName,
                    message: m.message,
                    timestamp: m.createdAt,
                })));
            }
        } catch (err) {
            console.error('Failed to load chat history:', err);
        }

        console.log(`User ${userName} joined room ${roomId}. Total: ${roomsData[roomId].length}`);
    });

    socket.on('cursor-move', ({ roomId, x, y, userName, color }) => {
        socket.to(roomId).emit('cursor-moved', { socketId: socket.id, x, y, userName, color });
    });

    socket.on('burst-ping', ({ roomId, x, y, color }) => {
        socket.to(roomId).emit('burst-ping-received', { x, y, color });
    });

    socket.on('chat-message', async ({ roomId, message, userName }) => {
        const timestamp = new Date();

        // Persist to DB
        try {
            await prisma.chatMessage.create({
                data: { boardId: roomId, userName, message },
            });
        } catch (err) {
            console.error('Failed to save chat message:', err);
        }

        // Broadcast to everyone else in the room (sender sees it via optimistic update)
        socket.to(roomId).emit('chat-message-received', { roomId, message, userName, timestamp });
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        socket.broadcast.emit('user-left', socket.id);

        // Find which room this user was in and remove them
        for (const roomId in roomsData) {
            if (roomsData[roomId]) {
                const index = roomsData[roomId].indexOf(socket.id);
                if (index !== -1) {
                    roomsData[roomId].splice(index, 1);
                    // If room is empty, mark session inactive
                    if (roomsData[roomId].length === 0) {
                        delete roomsData[roomId];
                        try {
                            // Find the active session for this board and close it
                            await prisma.session.updateMany({
                                where: { boardId: roomId, isActive: true },
                                data: { isActive: false, endTime: new Date() }
                            });
                            console.log(`Closed active session for board ${roomId}`);
                        } catch (error) {
                            console.error('Failed to close session on disconnect', error);
                        }
                    }
                    break;
                }
            }
        }
    });

    // Whiteboard Sync (Custom Yjs over Socket.io)
    socket.on('yjs-update', ({ roomId, update }) => {
        // Broadcast the update to all other users in the room
        // The update is a Buffer/ArrayBuffer
        socket.to(roomId).emit('yjs-update', update);
    });

    socket.on('request-yjs-state', (roomId) => {
        // Ask others in the room to broadcast their full state vector for the newly joined user
        socket.to(roomId).emit('send-yjs-state');
    });

    // WebRTC Signaling
    socket.on('webrtc-offer', ({ target, caller, sdp }) => {
        socket.to(target).emit('webrtc-offer', { caller, sdp });
    });

    socket.on('webrtc-answer', ({ target, caller, sdp }) => {
        socket.to(target).emit('webrtc-answer', { caller, sdp });
    });

    socket.on('webrtc-ice-candidate', ({ target, candidate }) => {
        socket.to(target).emit('webrtc-ice-candidate', { sender: socket.id, candidate });
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
