import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/public/Landing';
import Catalogo from './pages/public/Catalogo';
import CursoDetalle from './pages/public/CursoDetalle';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import MisCursos from './pages/estudiante/MisCursos';
import Leccion from './pages/estudiante/Leccion';
import AdminHome from './pages/admin/AdminHome';
import AdminCursos from './pages/admin/AdminCursos';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { User } from './types';

// Loading fallback component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
      <p className="text-neutral-600 dark:text-neutral-400">Cargando...</p>
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize app - check auth and theme
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Restore user from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Restore dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const toggleDarkMode = useCallback((): void => {
    setDarkMode((prev) => {
      const newDarkMode = !prev;
      localStorage.setItem('darkMode', String(newDarkMode));
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newDarkMode;
    });
  }, []);

  const handleUserLogin = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const handleUserLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <ScrollToTop>
        <div className="flex flex-col min-h-screen">
          <Navbar 
            user={user} 
            setUser={handleUserLogout} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/cursos/:id" element={<CursoDetalle />} />
              <Route 
                path="/login" 
                element={<Login setUser={handleUserLogin} />} 
              />
              <Route 
                path="/register" 
                element={<Register setUser={handleUserLogin} />} 
              />

              {/* Protected student routes */}
              <Route 
                path="/mis-cursos" 
                element={
                  <ProtectedRoute user={user}>
                    <MisCursos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cursos/:cursoId/lecciones/:leccionId" 
                element={
                  <ProtectedRoute user={user}>
                    <Leccion user={user!} />
                  </ProtectedRoute>
                } 
              />

              {/* Protected admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute user={user} requireAdmin={true}>
                    <AdminHome user={user!} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/cursos" 
                element={
                  <ProtectedRoute user={user} requireAdmin={true}>
                    <AdminCursos user={user!} />
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-neutral-900 dark:text-white mb-4">404</h1>
                      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
                        Página no encontrada
                      </p>
                      <a 
                        href="/" 
                        className="inline-block px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition"
                      >
                        Volver al Inicio
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </ScrollToTop>
    </Router>
  );
}

export default App;