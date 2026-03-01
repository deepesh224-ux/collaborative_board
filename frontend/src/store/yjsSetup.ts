import * as Y from 'yjs';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export interface YjsStore {
    ydoc: Y.Doc;
    socket: Socket;
    roomId: string;
    yElements: Y.Map<any>;
    awareness: {
        setLocalStateField: (field: string, val: any) => void;
        getStates: () => Map<number, any>;
        clientID: number;
        on: (event: string, cb: any) => void;
        off: (event: string, cb: any) => void;
    };
}

let store: YjsStore | null = null;
let currentSocket: Socket | null = null;
let currentUpdateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
let currentYdoc: Y.Doc | null = null;

export function initRoom(roomId: string, userId?: string): YjsStore {
    if (currentSocket) {
        currentSocket.disconnect();
        currentSocket = null;
    }
    if (currentYdoc && currentUpdateHandler) {
        currentYdoc.off('update', currentUpdateHandler);
    }

    const ydoc = new Y.Doc();
    currentYdoc = ydoc;

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    currentSocket = socket;

    socket.on('connect', () => {
        console.log('[Yjs] Socket connected:', socket.id);
        socket.emit('join-room', { roomId, userName: 'yjs-sync', color: '#6366f1', userId });
        socket.emit('request-yjs-state', roomId);
    });

    socket.on('yjs-update', (data: any) => {
        try {
            let update: Uint8Array;
            if (data instanceof Uint8Array) {
                update = data;
            } else if (data instanceof ArrayBuffer) {
                update = new Uint8Array(data);
            } else if (data && typeof data === 'object' && 'buffer' in data) {
                update = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            } else {
                return;
            }
            Y.applyUpdate(ydoc, update, 'remote');
        } catch (e) { }
    });

    socket.on('send-yjs-state', () => {
        const fullState = Y.encodeStateAsUpdate(ydoc);
        socket.emit('yjs-update', { roomId, update: fullState });
    });

    currentUpdateHandler = (update: Uint8Array, origin: any) => {
        if (origin !== 'remote') {
            socket.emit('yjs-update', { roomId, update });
        }
    };
    ydoc.on('update', currentUpdateHandler);

    const yElements = ydoc.getMap<any>('elements');

    const awareness = {
        setLocalStateField: (_field: string, _val: any) => { },
        getStates: () => new Map<number, any>(),
        clientID: Math.floor(Math.random() * 0xFFFFFFFF),
        on: (_e: string, _cb: any) => { },
        off: (_e: string, _cb: any) => { },
    };

    store = { ydoc, socket, roomId, yElements, awareness };
    return store;
}

export function getStore(): YjsStore {
    if (!store) throw new Error('[Yjs] Store not initialized – call initRoom first.');
    return store;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);
