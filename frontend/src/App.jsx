import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Restaurar user del localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Aplicar modo oscuro desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/cursos/:id" element={<CursoDetalle />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* Rutas estudiante */}
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
                  <Leccion user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Rutas admin */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} requireAdmin={true}>
                  <AdminHome user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/cursos" 
              element={
                <ProtectedRoute user={user} requireAdmin={true}>
                  <AdminCursos user={user} />
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
