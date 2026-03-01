import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const activeNow = await prisma.board.findMany({
            where: {
                sessions: { some: { isActive: true } },
                OR: [
                    { ownerId: userId },
                    { collaborators: { some: { id: userId } } }
                ]
            },
            include: { sessions: { where: { isActive: true } } },
        });

        const myBoards = await prisma.board.findMany({
            where: {
                ownerId: userId,
                isSaved: true
            },
        });

        const sharedWithMe = await prisma.board.findMany({
            where: {
                collaborators: { some: { id: userId } },
                isSaved: true
            },
        });

        res.json({
            myBoards,
            sharedWithMe,
            activeNow,
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};
