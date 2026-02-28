import { useState } from 'react';
import type { Tool } from './components/Toolbar';
import { Toolbar } from './components/Toolbar';
import { Whiteboard } from './components/Whiteboard';
import { colors } from './utils/colors';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  return (
    <div className="app-container">
      <Whiteboard activeTool={activeTool} selectedColor={selectedColor} />
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>
  );
}
