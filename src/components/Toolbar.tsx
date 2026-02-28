import { MousePointer2, Pencil, StickyNote, Navigation, Square, Circle } from 'lucide-react';
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
        <div className="toolbar">
            <button
                className={`tool-button ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => setActiveTool('select')}
                title="Select & Move"
            >
                <MousePointer2 size={24} />
            </button>

            <button
                className={`tool-button ${activeTool === 'draw' ? 'active' : ''}`}
                onClick={() => setActiveTool('draw')}
                title="Draw"
            >
                <Pencil size={24} />
            </button>

            {/* 
      <button 
        className={`tool-button ${activeTool === 'text' ? 'active' : ''}`}
        onClick={() => setActiveTool('text')}
        title="Text"
      >
        <Type size={24} />
      </button> 
      */}

            <button
                className={`tool-button ${activeTool === 'sticky' ? 'active' : ''}`}
                onClick={() => setActiveTool('sticky')}
                title="Sticky Note"
            >
                <StickyNote size={24} />
            </button>

            <button
                className={`tool-button ${activeTool === 'rectangle' ? 'active' : ''}`}
                onClick={() => setActiveTool('rectangle')}
                title="Rectangle"
            >
                <Square size={24} />
            </button>

            <button
                className={`tool-button ${activeTool === 'circle' ? 'active' : ''}`}
                onClick={() => setActiveTool('circle')}
                title="Circle"
            >
                <Circle size={24} />
            </button>

            <div style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            <div className="color-picker" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {colors.map(color => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: selectedColor === color ? '2px solid #333' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                        }}
                        title={color}
                    />
                ))}
            </div>

            <div style={{ width: 1, height: 24, backgroundColor: '#eee', margin: '0 8px' }} />

            <button
                className={`tool-button ping ${activeTool === 'ping' ? 'active' : ''}`}
                onClick={() => setActiveTool('ping')}
                title="Burst Ping (Click anywhere on canvas!)"
            >
                <Navigation size={24} />
            </button>
        </div>
    );
}
