import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import type { Path, StickyNote, TextShape, BasicShape } from '../types';

export const ydoc = new Y.Doc();

export interface YjsStore {
    ydoc: Y.Doc;
    provider: WebrtcProvider;
    awareness: any;
    yPaths: Y.Map<Path>;
    yNotes: Y.Map<StickyNote>;
    yTexts: Y.Map<TextShape>;
    yShapes: Y.Map<BasicShape>;
}

let store: YjsStore | null = null;

export function initRoom(roomId: string): YjsStore {
    if (store) {
        store.provider.destroy();
    }

    const provider = new WebrtcProvider(`collaborative-whiteboard-${roomId}`, ydoc, {
        signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com']
    });

    const awareness = provider.awareness;
    const yPaths = ydoc.getMap<Path>('paths');
    const yNotes = ydoc.getMap<StickyNote>('notes');
    const yTexts = ydoc.getMap<TextShape>('texts');
    const yShapes = ydoc.getMap<BasicShape>('shapes');

    store = { ydoc, provider, awareness, yPaths, yNotes, yTexts, yShapes };
    return store;
}

export function getStore(): YjsStore {
    if (!store) throw new Error('Room not initialized');
    return store;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);

