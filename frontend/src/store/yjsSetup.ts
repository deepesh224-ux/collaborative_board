import * as Y from 'yjs';
import { io, Socket } from 'socket.io-client';
import type { Path, StickyNote, TextShape, BasicShape } from '../types';

const SOCKET_URL = 'http://localhost:5001';

export const ydoc = new Y.Doc();

export interface YjsStore {
    ydoc: Y.Doc;
    provider: any;
    awareness: any;
    yPaths: Y.Map<Path>;
    yNotes: Y.Map<StickyNote>;
    yTexts: Y.Map<TextShape>;
    yShapes: Y.Map<BasicShape>;
}

let store: YjsStore | null = null;
let currentSocket: Socket | null = null;
let currentUpdateHandler: any = null;

export function initRoom(roomId: string): YjsStore {
    if (currentSocket) {
        if (currentUpdateHandler) {
            ydoc.off('update', currentUpdateHandler);
        }
        currentSocket.disconnect();
    }

    const socket = io(SOCKET_URL);
    currentSocket = socket;

    socket.emit('join-room', { roomId, userName: 'System-Store', color: '#000' });

    socket.on('yjs-update', (updateBuffer: ArrayBuffer) => {
        Y.applyUpdate(ydoc, new Uint8Array(updateBuffer), 'socket-store');
    });

    currentUpdateHandler = (update: Uint8Array, origin: any) => {
        if (origin !== 'socket-store') {
            socket.emit('yjs-update', { roomId, update });
        }
    };

    ydoc.on('update', currentUpdateHandler);

    socket.emit('request-yjs-state', roomId);

    socket.on('send-yjs-state', () => {
        const stateVector = Y.encodeStateAsUpdate(ydoc);
        socket.emit('yjs-update', { roomId, update: stateVector });
    });

    const mockAwareness = { setLocalStateField: () => { }, getStates: () => new Map() };

    const yPaths = ydoc.getMap<Path>('paths');
    const yNotes = ydoc.getMap<StickyNote>('notes');
    const yTexts = ydoc.getMap<TextShape>('texts');
    const yShapes = ydoc.getMap<BasicShape>('shapes');

    store = { ydoc, provider: null, awareness: mockAwareness, yPaths, yNotes, yTexts, yShapes };
    return store;
}

export function getStore(): YjsStore {
    if (!store) throw new Error('Room not initialized');
    return store;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);


