import { useRef, useState, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';
import type { Tool } from './Toolbar';
import { useWhiteboard } from '../hooks/useWhiteboard';
import { useAwareness } from '../hooks/useAwareness';
import { generatePathData } from '../utils/getStroke';
import { StickyNoteComponent } from './StickyNoteComponent';
import { LiveCursors } from './LiveCursors';
import type { Point } from '../types';

interface WhiteboardProps {
    activeTool: Tool;
    selectedColor: string;
}

export function Whiteboard({ activeTool, selectedColor }: WhiteboardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { paths, notes, shapes, addPath, updatePath, addNote, updateNote, removeNote, addShape, updateShape } = useWhiteboard();
    const { updateCursor, sendPing, clientId } = useAwareness();

    const [currentPathId, setCurrentPathId] = useState<string | null>(null);
    const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [guestName] = useState(`Guest ${clientId.toString().slice(-4)}`);

    // Transform state for panning/zooming
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

    // Handle pointer movements for live cursors
    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - transform.x) / transform.scale;
            const y = (e.clientY - rect.top - transform.y) / transform.scale;

            updateCursor({
                x,
                y,
                color: selectedColor,
                name: guestName
            });
        };

        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [updateCursor, transform, selectedColor, guestName]);

    // Gestures for panning, drawing, etc
    useGesture(
        {
            onDrag: ({ event, movement: [dx, dy], first, last, memo }) => {
                const e = event as PointerEvent;
                // Middle click or select tool = pan
                if (e.buttons === 4 || activeTool === 'select') {
                    if (first) return { x: transform.x, y: transform.y };
                    if (memo) {
                        setTransform(t => ({ ...t, x: memo.x + dx, y: memo.y + dy }));
                    }
                    return memo;
                }

                if (activeTool === 'draw') {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const pX = (e.clientX - rect.left - transform.x) / transform.scale;
                    const pY = (e.clientY - rect.top - transform.y) / transform.scale;
                    const point: Point = [pX, pY, e.pressure || 0.5];

                    if (first) {
                        const id = Math.random().toString(36).substring(2, 9);
                        setCurrentPathId(id);
                        addPath({ id, points: [point], color: selectedColor, width: 8 });
                        return id;
                    } else if (currentPathId) {
                        const existingPath = paths[currentPathId];
                        if (existingPath) {
                            updatePath(currentPathId, { points: [...existingPath.points, point] });
                        }
                    }
                    if (last) setCurrentPathId(null);
                } else if (activeTool === 'rectangle' || activeTool === 'circle') {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const pX = (e.clientX - rect.left - transform.x) / transform.scale;
                    const pY = (e.clientY - rect.top - transform.y) / transform.scale;

                    if (first) {
                        const id = Math.random().toString(36).substring(2, 9);
                        setCurrentShapeId(id);
                        setStartPos({ x: pX, y: pY });
                        addShape({
                            id,
                            type: activeTool,
                            color: selectedColor,
                            x: pX,
                            y: pY,
                            width: 0,
                            height: 0
                        });
                        return id;
                    } else if (currentShapeId && startPos) {
                        const existingShape = shapes[currentShapeId];
                        if (existingShape) {
                            // Calculate bounds
                            const minX = Math.min(startPos.x, pX);
                            const minY = Math.min(startPos.y, pY);
                            const width = Math.abs(pX - startPos.x);
                            const height = Math.abs(pY - startPos.y);

                            updateShape(currentShapeId, {
                                x: minX,
                                y: minY,
                                width,
                                height
                            });
                        }
                    }
                    if (last) {
                        setCurrentShapeId(null);
                        setStartPos(null);
                    }
                }
            },
            onWheel: ({ event, delta: [, dy], ctrlKey }) => {
                if (ctrlKey) {
                    event.preventDefault();
                    // Zoom
                    setTransform(t => {
                        const newScale = Math.max(0.1, Math.min(t.scale - dy * 0.01, 5));
                        return { ...t, scale: newScale };
                    });
                }
            },
            onClick: ({ event }) => {
                const e = event as PointerEvent;
                if (!containerRef.current) return;

                // Prevent trigger if clicking on something that isn't the canvas
                if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') return;

                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - transform.x) / transform.scale;
                const y = (e.clientY - rect.top - transform.y) / transform.scale;

                if (activeTool === 'sticky') {
                    addNote({
                        x,
                        y,
                        text: '',
                        color: selectedColor
                    });
                } else if (activeTool === 'ping') {
                    sendPing({
                        id: Math.random().toString(36).substring(2, 9),
                        x,
                        y,
                        timestamp: Date.now(),
                        userId: clientId.toString()
                    });
                }
            }
        },
        {
            target: containerRef,
            eventOptions: { passive: false },
        }
    );

    return (
        <div
            ref={containerRef}
            className="board-container"
            style={{
                cursor: activeTool === 'draw' ? 'crosshair' :
                    activeTool === 'sticky' ? 'copy' :
                        activeTool === 'select' ? 'grab' :
                            activeTool === 'ping' ? 'crosshair' : 'default'
            }}
        >
            <div
                className="canvas-layer"
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
            >
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                    {Object.values(paths).map(path => (
                        <path
                            key={path.id}
                            d={generatePathData(path.points)}
                            fill={path.color}
                        />
                    ))}
                    {Object.values(shapes).map(shape => {
                        if (shape.type === 'rectangle') {
                            return (
                                <rect
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    fill={shape.color}
                                    rx={12}
                                />
                            );
                        } else if (shape.type === 'circle') {
                            const cx = shape.x + shape.width / 2;
                            const cy = shape.y + shape.height / 2;
                            const rx = shape.width / 2;
                            const ry = shape.height / 2;
                            return (
                                <ellipse
                                    key={shape.id}
                                    cx={cx}
                                    cy={cy}
                                    rx={rx}
                                    ry={ry}
                                    fill={shape.color}
                                />
                            );
                        }
                        return null;
                    })}
                </svg>

                <div className="shapes-layer">
                    {Object.values(notes).map(note => (
                        <StickyNoteComponent
                            key={note.id}
                            note={note}
                            updateNote={updateNote}
                            removeNote={removeNote}
                        />
                    ))}
                </div>

                <LiveCursors />
            </div>
        </div>
    );
}
