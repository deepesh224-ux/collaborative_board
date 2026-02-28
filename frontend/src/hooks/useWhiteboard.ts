import type { Path, StickyNote, TextShape, BasicShape } from '../types';
import { getStore, generateId } from '../store/yjsSetup';
import { useEffect as useReactEffect, useState as useReactState, useCallback as useReactCallback } from 'react';

export function useWhiteboard() {
    const [paths, setPaths] = useReactState<Record<string, Path>>({});
    const [notes, setNotes] = useReactState<Record<string, StickyNote>>({});
    const [texts, setTexts] = useReactState<Record<string, TextShape>>({});
    const [shapes, setShapes] = useReactState<Record<string, BasicShape>>({});

    const { yPaths, yNotes, yTexts, yShapes } = getStore();

    useReactEffect(() => {
        // Initial load
        setPaths(Object.fromEntries(yPaths.entries()));
        setNotes(Object.fromEntries(yNotes.entries()));
        setTexts(Object.fromEntries(yTexts.entries()));
        setShapes(Object.fromEntries(yShapes.entries()));

        // Observers
        const observerPaths = () => setPaths(Object.fromEntries(yPaths.entries()));
        const observerNotes = () => setNotes(Object.fromEntries(yNotes.entries()));
        const observerTexts = () => setTexts(Object.fromEntries(yTexts.entries()));
        const observerShapes = () => setShapes(Object.fromEntries(yShapes.entries()));

        yPaths.observe(observerPaths);
        yNotes.observe(observerNotes);
        yTexts.observe(observerTexts);
        yShapes.observe(observerShapes);

        return () => {
            yPaths.unobserve(observerPaths);
            yNotes.unobserve(observerNotes);
            yTexts.unobserve(observerTexts);
            yShapes.unobserve(observerShapes);
        };
    }, [yPaths, yNotes, yTexts, yShapes]);

    const addPath = useReactCallback((path: Path) => {
        yPaths.set(path.id, path);
    }, [yPaths]);

    const updatePath = useReactCallback((id: string, path: Partial<Path>) => {
        const existing = yPaths.get(id);
        if (existing) {
            yPaths.set(id, { ...existing, ...path });
        }
    }, [yPaths]);

    const addNote = useReactCallback((note: Omit<StickyNote, 'id'>) => {
        const id = generateId();
        yNotes.set(id, { ...note, id });
    }, [yNotes]);

    const updateNote = useReactCallback((id: string, note: Partial<StickyNote>) => {
        const existing = yNotes.get(id);
        if (existing) {
            yNotes.set(id, { ...existing, ...note });
        }
    }, [yNotes]);

    const removeNote = useReactCallback((id: string) => {
        yNotes.delete(id);
    }, [yNotes]);

    const addText = useReactCallback((text: Omit<TextShape, 'id'>) => {
        const id = generateId();
        yTexts.set(id, { ...text, id });
    }, [yTexts]);

    const updateText = useReactCallback((id: string, text: Partial<TextShape>) => {
        const existing = yTexts.get(id);
        if (existing) {
            yTexts.set(id, { ...existing, ...text });
        }
    }, [yTexts]);

    const removeText = useReactCallback((id: string) => {
        yTexts.delete(id);
    }, [yTexts]);

    const addShape = useReactCallback((shape: BasicShape) => {
        yShapes.set(shape.id, shape);
    }, [yShapes]);

    const updateShape = useReactCallback((id: string, shape: Partial<BasicShape>) => {
        const existing = yShapes.get(id);
        if (existing) {
            yShapes.set(id, { ...existing, ...shape });
        }
    }, [yShapes]);

    const removeShape = useReactCallback((id: string) => {
        yShapes.delete(id);
    }, [yShapes]);

    const clearCanvas = useReactCallback(() => {
        Array.from(yPaths.keys()).forEach(key => yPaths.delete(key));
        Array.from(yNotes.keys()).forEach(key => yNotes.delete(key));
        Array.from(yTexts.keys()).forEach(key => yTexts.delete(key));
        Array.from(yShapes.keys()).forEach(key => yShapes.delete(key));
    }, [yPaths, yNotes, yTexts, yShapes]);

    return {
        paths,
        notes,
        texts,
        shapes,
        addPath,
        updatePath,
        addNote,
        updateNote,
        removeNote,
        addText,
        updateText,
        removeText,
        addShape,
        updateShape,
        removeShape,
        clearCanvas,
    };
}

