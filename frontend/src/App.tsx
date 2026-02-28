import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Whiteboard } from './components/Whiteboard';
import { LandingPage } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignInPage from './components/ui/travel-connect-signin-1';
import { initRoom } from './store/yjsSetup';

function WhiteboardRoom({ isDarkMode }: { isDarkMode: boolean }) {
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
        <Whiteboard isDarkModeGlobal={isDarkMode} />
      </div>
    </>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:roomId" element={<WhiteboardRoom isDarkMode={isDarkMode} />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}
