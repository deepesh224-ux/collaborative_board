import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Whiteboard } from './components/Whiteboard';
import { LandingPage } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SignInPage from './components/ui/travel-connect-signin-1';
import { initRoom } from './store/yjsSetup';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function WhiteboardRoom({ isDarkMode }: { isDarkMode: boolean }) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (roomId) {
      initRoom(roomId, user?.id);
      setIsInitialized(true);
    } else {
      navigate('/');
    }
  }, [roomId, navigate, user?.id]);

  if (!isInitialized) return null;

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Whiteboard isDarkModeGlobal={isDarkMode} />
      </div>
    </ProtectedRoute>
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/room/:roomId" element={<WhiteboardRoom isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
