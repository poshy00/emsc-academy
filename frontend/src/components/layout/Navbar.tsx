import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut, BookOpen, GraduationCap, Shield, User, ExternalLink } from 'lucide-react';
import { User as UserType } from '@/types';

interface NavbarProps {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ user, setUser, darkMode, toggleDarkMode }: NavbarProps): React.ReactElement {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getDashboardLink = (): string => {
    if (!user) return '/login';
    switch (user.rol) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor/dashboard';
      case 'estudiante':
      default:
        return '/mis-cursos';
    }
  };

  const getDashboardLabel = (): string => {
    if (!user) return '';
    switch (user.rol) {
      case 'admin':
        return 'Panel Admin';
      case 'instructor':
        return 'Instructor';
      case 'estudiante':
      default:
        return 'Mis Cursos';
    }
  };

  const getDashboardIcon = (): React.ReactNode => {
    if (!user) return null;
    switch (user.rol) {
      case 'admin':
        return <Shield size={18} />;
      case 'instructor':
        return <GraduationCap size={18} />;
      case 'estudiante':
      default:
        return <BookOpen size={18} />;
    }
  };

  return (
    <nav className="bg-white dark:bg-neutral-800 shadow-sm sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with better branding */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="EMSC Academy - Inicio">
            <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
              E
            </div>
            <span className="font-bold text-xl text-neutral-900 dark:text-white hidden sm:inline tracking-tight">
              EMSC<span className="text-brand-600 dark:text-brand-400">Academy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/catalogo" 
              className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2"
            >
              Catálogo
            </Link>
            <a 
              href="https://emsc.es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors py-2 flex items-center gap-1"
            >
              Web Principal
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle - Accessible */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {darkMode ? <Sun size={20} className="text-warning-500" /> : <Moon size={20} className="text-neutral-600" />}
            </button>

            {/* Auth / User Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.nombre} 
                      className="w-8 h-8 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                      <User size={18} className="text-brand-600 dark:text-brand-400" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium text-neutral-900 dark:text-white">
                    {user.nombre?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu with animation */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-2 z-50 animate-scale-in origin-top-right">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {user.nombre}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 capitalize">
                        {user.rol}
                      </span>
                    </div>

                    {/* Menu items */}
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                    >
                      {getDashboardIcon()}
                      {getDashboardLabel()}
                    </Link>

                    {user.rol === 'admin' && (
                      <Link
                        to="/admin/cursos"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                      >
                        <BookOpen size={18} />
                        Gestionar Cursos
                      </Link>
                    )}

                    <hr className="my-1 border-neutral-200 dark:border-neutral-700" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                    >
                      <LogOut size={18} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-brand-600 dark:text-brand-400 font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setOpen(!open)} 
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {open && (
          <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 animate-slide-down">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/catalogo"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors font-medium"
              >
                📚 Catálogo de Cursos
              </Link>
              <a
                href="https://emsc.es"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Web Principal EMSC
              </a>

              {user && (
                <>
                  <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
                  
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors"
                  >
                    {getDashboardIcon()}
                    <span className="font-medium">{getDashboardLabel()}</span>
                  </Link>

                  {user.rol === 'admin' && (
                    <Link
                      to="/admin/cursos"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors"
                    >
                      <BookOpen size={18} />
                      Gestionar Cursos
                    </Link>
                  )}

                  {/* Mobile CTA for quick actions */}
                  <Link
                    to="/mis-cursos"
                    onClick={() => setOpen(false)}
                    className="mt-2 mx-4 px-4 py-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium rounded-lg text-center"
                  >
                    Continuar Aprendiendo
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 mx-4 mt-2 px-4 py-3 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
}