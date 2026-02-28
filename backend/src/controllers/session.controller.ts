import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createSession = async (req: Request, res: Response) => {
    const { name, ownerId } = req.body;
    try {
        const board = await prisma.board.create({
            data: {
                name: name || 'Untitled Board',
                ownerId,
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

export const getSession = async (req: Request, res: Response) => {
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

export const joinSession = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { userId } = req.body;
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

export const updateSessionData = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { data } = req.body; // CRDT update or Full state
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

export const deleteSession = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.board.delete({
            where: { id },
        });
        res.json({ message: 'Board deleted successfully' });
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).json({ error: 'Failed to delete board' });
    }
};
