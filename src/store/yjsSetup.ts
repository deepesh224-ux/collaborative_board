import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import type { Path, StickyNote, TextShape, BasicShape } from '../types';

export const ydoc = new Y.Doc();
// We connect to a public generic signaling server for the P2P part
export const provider = new WebrtcProvider('collaborative-whiteboard-demo-room', ydoc, {
    signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com']
});

export const awareness = provider.awareness;

// Defines shared data structures
export const yPaths = ydoc.getMap<Path>('paths');
export const yNotes = ydoc.getMap<StickyNote>('notes');
export const yTexts = ydoc.getMap<TextShape>('texts');
export const yShapes = ydoc.getMap<BasicShape>('shapes');

export const generateId = () => Math.random().toString(36).substring(2, 9);
