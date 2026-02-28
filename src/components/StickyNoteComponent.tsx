import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { StickyNote as StickyNoteType } from '../types';

interface StickyNoteProps {
    note: StickyNoteType;
    updateNote: (id: string, note: Partial<StickyNoteType>) => void;
    removeNote: (id: string) => void;
}

export function StickyNoteComponent({ note, updateNote, removeNote }: StickyNoteProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.value = note.text;
        }
    }, [note.text]);

    const handleDragEnd = (_event: any, info: any) => {
        updateNote(note.id, {
            x: note.x + info.offset.x,
            y: note.y + info.offset.y,
        });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNote(note.id, { text: e.target.value });
    };

    return (
        <motion.div
            className="sticky-note"
            style={{ backgroundColor: note.color, x: note.x, y: note.y }}
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
        >
            <textarea
                ref={textareaRef}
                onChange={handleTextChange}
                placeholder="Type something..."
                onPointerDown={(e) => e.stopPropagation()} // Let user click to type instead of dragging
            />

            <button
                className="sticky-delete"
                onClick={() => removeNote(note.id)}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
}
