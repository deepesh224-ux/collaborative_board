import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionRoutes from './routes/session';
import userRoutes from './routes/user';

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
app.use('/api/sessions', sessionRoutes);
app.use('/api/user', userRoutes);

// Socket.io Presence and Collaboration
const roomsData: Record<string, any> = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', ({ roomId, userName, color }) => {
        socket.join(roomId);

        // Notify others about the new participant
        socket.to(roomId).emit('user-joined', { socketId: socket.id, userName, color });

        // Send current participants list to the new user
        // (In a real app, you'd manage this state more robustly)
        console.log(`User ${userName} joined room ${roomId}`);
    });

    socket.on('cursor-move', ({ roomId, x, y, userName, color }) => {
        socket.to(roomId).emit('cursor-moved', { socketId: socket.id, x, y, userName, color });
    });

    socket.on('burst-ping', ({ roomId, x, y, color }) => {
        socket.to(roomId).emit('burst-ping-received', { x, y, color });
    });

    socket.on('chat-message', ({ roomId, message, userName }) => {
        io.to(roomId).emit('chat-message-received', { message, userName, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // You could broadcast a 'user-left' event here
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
