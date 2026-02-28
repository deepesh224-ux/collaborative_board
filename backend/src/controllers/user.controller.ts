import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboard = async (req: Request, res: Response) => {
    const userId = req.headers['user-id'] as string; // Placeholder for real auth
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const myBoards = await prisma.board.findMany({
            where: { ownerId: userId },
            include: { sessions: { where: { isActive: true } } },
        });

        const sharedWithMe = await prisma.board.findMany({
            where: { collaborators: { some: { id: userId } } },
            include: { sessions: { where: { isActive: true } } },
        });

        res.json({
            myBoards,
            sharedWithMe,
            activeNow: [...myBoards, ...sharedWithMe].filter(b => b.sessions.length > 0),
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};
