import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboard = async (req: Request, res: Response) => {
    const userId = req.headers['user-id'] as string; // Placeholder for real auth
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
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};
