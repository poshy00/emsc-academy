import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';

export default function Navbar({ user, setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:inline">
              EMSC Academy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/catalogo" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Catálogo
            </Link>
            {user && (
              <>
                {user.rol === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                {user.rol === 'estudiante' && (
                  <Link to="/mis-cursos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                    Mis Cursos
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Registrar
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setOpen(!open)} className="md:hidden">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t">
            <Link to="/catalogo" className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Catálogo
            </Link>
            {user && (
              <>
                {user.rol === 'admin' && (
                  <Link to="/admin" className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Admin
                  </Link>
                )}
                {user.rol === 'estudiante' && (
                  <Link to="/mis-cursos" className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Mis Cursos
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
