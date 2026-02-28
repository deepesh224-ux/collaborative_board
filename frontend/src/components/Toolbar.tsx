import { MousePointer2, Pencil, StickyNote, Navigation, Square, Circle, Type } from 'lucide-react';
import { colors } from '../utils/colors';

export type Tool = 'select' | 'draw' | 'text' | 'sticky' | 'ping' | 'rectangle' | 'circle';

interface ToolbarProps {
    activeTool: Tool;
    setActiveTool: (tool: Tool) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

export function Toolbar({ activeTool, setActiveTool, selectedColor, setSelectedColor }: ToolbarProps) {
    return (
        <div className="toolbar glass">
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

            <button
                className={`tool-button ping ${activeTool === 'ping' ? 'active' : ''}`}
                onClick={() => setActiveTool('ping')}
                style={{ marginLeft: '8px' }}
                title="Burst Ping (Click anywhere!)"
            >
                <Navigation size={22} />
            </button>
        </div>
    );
}

