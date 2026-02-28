import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import type { Tool } from './components/Toolbar';
import { Toolbar } from './components/Toolbar';
import { Whiteboard } from './components/Whiteboard';
import { UserList } from './components/UserList';
import { LandingPage } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignInPage from './components/ui/travel-connect-signin-1';
import { colors } from './utils/colors';
import { initRoom } from './store/yjsSetup';

function WhiteboardRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (roomId) {
      initRoom(roomId);
      setIsInitialized(true);
    } else {
      navigate('/');
    }
  }, [roomId, navigate]);

  if (!isInitialized) return null;

  return (
    <>
      <div className="app-container">
        <UserList />
        <Whiteboard activeTool={activeTool} selectedColor={selectedColor} />
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:roomId" element={<WhiteboardRoom />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
