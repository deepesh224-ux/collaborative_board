import { MousePointer2, Pencil, StickyNote, Navigation, Square, Circle, Type, Eraser, Image as ImageIcon, Triangle, ArrowUpRight, Minus, Plus, Undo, Redo, Share2 } from 'lucide-react';
import { colors } from '../utils/colors';
import { motion } from 'framer-motion';

export type Tool = 'select' | 'draw' | 'text' | 'sticky' | 'ping' | 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line' | 'eraser' | 'image' | 'emoji';

interface ToolbarProps {
    activeTool: Tool;
    setActiveTool: (tool: Tool) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    isFilled: boolean;
    setIsFilled: (filled: boolean) => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

export function Toolbar({
    activeTool, setActiveTool,
    selectedColor, setSelectedColor,
    canUndo, canRedo, undo, redo,
    onImageUpload,
    strokeWidth, setStrokeWidth,
    fontFamily, setFontFamily,
    isFilled, setIsFilled,
    zoomIn, zoomOut
}: ToolbarProps) {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Room link copied to clipboard!');
    };

    return (
        <motion.div
            className="toolbar glass"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <button
                className={`tool-button ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => setActiveTool('select')}
                title="Select & Move"
            >
                <MousePointer2 size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'draw' ? 'active' : ''}`}
                onClick={() => setActiveTool('draw')}
                title="Draw"
            >
                <Pencil size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTool('text')}
                title="Text"
            >
                <Type size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'sticky' ? 'active' : ''}`}
                onClick={() => setActiveTool('sticky')}
                title="Sticky Note"
            >
                <StickyNote size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'rectangle' ? 'active' : ''}`}
                onClick={() => setActiveTool('rectangle')}
                title="Rectangle"
            >
                <Square size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'circle' ? 'active' : ''}`}
                onClick={() => setActiveTool('circle')}
                title="Circle"
            >
                <Circle size={22} />
            </button>
            <button
                className={`tool-button ${activeTool === 'triangle' ? 'active' : ''}`}
                onClick={() => setActiveTool('triangle')}
                title="Triangle"
            >
                <Triangle size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'arrow' ? 'active' : ''}`}
                onClick={() => setActiveTool('arrow')}
                title="Arrow"
            >
                <ArrowUpRight size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'line' ? 'active' : ''}`}
                onClick={() => setActiveTool('line')}
                title="Line"
            >
                <Minus size={22} />
            </button>

            <button
                className={`tool-button ${activeTool === 'eraser' ? 'active' : ''}`}
                onClick={() => setActiveTool('eraser')}
                title="Eraser"
            >
                <Eraser size={22} />
            </button>

            <div style={{ position: 'relative' }}>
                <input
                    id="imageUploadInput"
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                    title="Insert Image"
                />
                <button
                    className={`tool-button ${activeTool === 'image' ? 'active' : ''}`}
                    title="Insert Image"
                >
                    <ImageIcon size={22} />
                </button>
            </div>

            <button
                className={`tool-button ${activeTool === 'emoji' ? 'active' : ''}`}
                onClick={() => setActiveTool('emoji')}
                title="Stickers & Emojis"
            >
                😀
            </button>

            <div className="vertical-divider" style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            <div style={{ display: 'flex', gap: '4px' }}>
                <button className="tool-button" onClick={zoomOut} title="Zoom Out">
                    <Minus size={18} />
                </button>
                <button className="tool-button" onClick={zoomIn} title="Zoom In">
                    <Plus size={18} />
                </button>
            </div>

            <div className="vertical-divider" style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            <div className="color-picker">
                {colors.map(color => (
                    <button
                        key={color}
                        className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            <div className="vertical-divider" style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            <button
                className="tool-button"
                onClick={undo}
                disabled={!canUndo}
                style={{ opacity: canUndo ? 1 : 0.5, cursor: canUndo ? 'pointer' : 'default' }}
                title="Undo"
            >
                <Undo size={22} />
            </button>

            <button
                className="tool-button"
                onClick={redo}
                disabled={!canRedo}
                style={{ opacity: canRedo ? 1 : 0.5, cursor: canRedo ? 'pointer' : 'default' }}
                title="Redo"
            >
                <Redo size={22} />
            </button>

            <div className="vertical-divider" style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            {/* Contextual Options */}
            {
                ['draw', 'line', 'triangle', 'arrow', 'rectangle', 'circle'].includes(activeTool) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Width</span>
                        <input
                            type="range"
                            min="2" max="24"
                            value={strokeWidth}
                            onChange={(e) => setStrokeWidth(Number(e.target.value))}
                            style={{ width: '60px' }}
                        />
                    </div>
                )
            }

            {
                ['rectangle', 'circle', 'triangle'].includes(activeTool) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
                        <input
                            type="checkbox"
                            checked={isFilled}
                            onChange={(e) => setIsFilled(e.target.checked)}
                            id="fillCheckbox"
                        />
                        <label htmlFor="fillCheckbox" style={{ fontSize: '12px', color: '#666', cursor: 'pointer' }}>Fill</label>
                    </div>
                )
            }

            {
                ['text', 'sticky'].includes(activeTool) && (
                    <div style={{ padding: '0 8px' }}>
                        <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                        >
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans</option>
                            <option value="'Times New Roman', Times, serif">Serif</option>
                            <option value="'Courier New', Courier, monospace">Monospace</option>
                        </select>
                    </div>
                )
            }

            {
                (['draw', 'line', 'triangle', 'arrow', 'rectangle', 'circle', 'text', 'sticky'].includes(activeTool) || ['select', 'eraser', 'image'].includes(activeTool) === false) && (
                    <div className="vertical-divider" style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />
                )
            }

            <button
                className={`tool-button ping ${activeTool === 'ping' ? 'active' : ''}`}
                onClick={() => setActiveTool('ping')}
                style={{ marginLeft: '8px' }}
                title="Burst Ping (Click anywhere!)"
            >
                <Navigation size={22} />
            </button>

            <button
                className="tool-button"
                onClick={handleShare}
                style={{ marginLeft: '8px' }}
                title="Share Room"
            >
                <Share2 size={22} />
            </button>
        </motion.div>
    );
}

