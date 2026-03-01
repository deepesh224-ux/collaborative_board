import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createSession = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const board = await prisma.board.create({
            data: {
                name: name || 'Untitled Board',
                ownerId: userId,
            },
        });
        const session = await prisma.session.create({
            data: {
                boardId: board.id,
            },
        });
        res.status(201).json({ board, session });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
};

export const getSession = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    try {
        const board = await prisma.board.findUnique({
            where: { id },
            include: {
                sessions: {
                    orderBy: { startTime: 'desc' },
                    take: 1,
                },
                owner: { select: { name: true, email: true } },
            },
        });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        res.json(board);
    } catch (error) {
        console.error('Error getting session:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
};

export const joinSession = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const board = await prisma.board.update({
            where: { id },
            data: {
                collaborators: { connect: { id: userId } },
            },
        });
        res.json(board);
    } catch (error) {
        console.error('Error joining session:', error);
        res.status(500).json({ error: 'Failed to join session' });
    }
};

export const updateSessionData = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { data } = req.body;
    try {
        const board = await prisma.board.update({
            where: { id },
            data: { data },
        });
        res.json(board);
    } catch (error) {
        console.error('Error updating session data:', error);
        res.status(500).json({ error: 'Failed to save session data' });
    }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.userId;
    try {
        const board = await prisma.board.findUnique({ where: { id } });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        if (board.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

        await prisma.board.delete({
            where: { id },
        });
        res.json({ message: 'Board deleted successfully' });
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).json({ error: 'Failed to delete board' });
    }
};

export const saveSession = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.userId;
    const { data } = req.body; // whiteboard elements from frontend
    try {
        const board = await prisma.board.findUnique({ where: { id } });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        if (board.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

        const updatedBoard = await prisma.board.update({
            where: { id },
            data: {
                isSaved: true,
                ...(data !== undefined ? { data } : {}),
            },
        });
        res.json({ message: 'Project saved to dashboard', board: updatedBoard });
    } catch (error) {
        console.error('Error saving board:', error);
        res.status(500).json({ error: 'Failed to save board' });
    }
};
