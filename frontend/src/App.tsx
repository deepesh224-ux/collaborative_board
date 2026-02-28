import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Whiteboard } from './components/Whiteboard';
import { LandingPage } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignInPage from './components/ui/travel-connect-signin-1';
import { initRoom } from './store/yjsSetup';

function WhiteboardRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
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
        <Whiteboard />
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
