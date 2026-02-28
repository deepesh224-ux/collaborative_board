import type { Path, StickyNote, TextShape, BasicShape } from '../types';
import { yPaths, yNotes, yTexts, yShapes, generateId } from '../store/yjsSetup';
import { useEffect as useReactEffect, useState as useReactState, useCallback as useReactCallback } from 'react';

export function useWhiteboard() {
    const [paths, setPaths] = useReactState<Record<string, Path>>({});
    const [notes, setNotes] = useReactState<Record<string, StickyNote>>({});
    const [texts, setTexts] = useReactState<Record<string, TextShape>>({});
    const [shapes, setShapes] = useReactState<Record<string, BasicShape>>({});

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
    }, []);

    const addPath = useReactCallback((path: Path) => {
        yPaths.set(path.id, path);
    }, []);

    const updatePath = useReactCallback((id: string, path: Partial<Path>) => {
        const existing = yPaths.get(id);
        if (existing) {
            yPaths.set(id, { ...existing, ...path });
        }
    }, []);

    const addNote = useReactCallback((note: Omit<StickyNote, 'id'>) => {
        const id = generateId();
        yNotes.set(id, { ...note, id });
    }, []);

    const updateNote = useReactCallback((id: string, note: Partial<StickyNote>) => {
        const existing = yNotes.get(id);
        if (existing) {
            yNotes.set(id, { ...existing, ...note });
        }
    }, []);

    const removeNote = useReactCallback((id: string) => {
        yNotes.delete(id);
    }, []);

    const addText = useReactCallback((text: Omit<TextShape, 'id'>) => {
        const id = generateId();
        yTexts.set(id, { ...text, id });
    }, []);

    const updateText = useReactCallback((id: string, text: Partial<TextShape>) => {
        const existing = yTexts.get(id);
        if (existing) {
            yTexts.set(id, { ...existing, ...text });
        }
    }, []);

    const removeText = useReactCallback((id: string) => {
        yTexts.delete(id);
    }, []);

    const addShape = useReactCallback((shape: BasicShape) => {
        yShapes.set(shape.id, shape);
    }, []);

    const updateShape = useReactCallback((id: string, shape: Partial<BasicShape>) => {
        const existing = yShapes.get(id);
        if (existing) {
            yShapes.set(id, { ...existing, ...shape });
        }
    }, []);

    const removeShape = useReactCallback((id: string) => {
        yShapes.delete(id);
    }, []);

    const clearCanvas = useReactCallback(() => {
        Array.from(yPaths.keys()).forEach(key => yPaths.delete(key));
        Array.from(yNotes.keys()).forEach(key => yNotes.delete(key));
        Array.from(yTexts.keys()).forEach(key => yTexts.delete(key));
        Array.from(yShapes.keys()).forEach(key => yShapes.delete(key));
    }, []);

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
