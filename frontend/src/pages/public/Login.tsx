import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthService } from '@/services';
import { User, LoginFormData } from '@/types';
import { Input, Button, Alert, Card } from '@/components/ui';

interface LoginProps {
  setUser: (user: User) => void;
}

export default function Login({ setUser }: LoginProps): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      // Store user and token
      localStorage.setItem('token', response.session.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      // Redirect based on role
      if (response.user.rol === 'admin') {
        navigate('/admin');
      } else if (response.user.rol === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/mis-cursos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en login. Intenta de nuevo.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              E
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              EMSC<span className="text-brand-600">Academy</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Accede a tu cuenta para continuar aprendiendo
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          {error && (
            <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              leftIcon={<Mail size={18} />}
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-600 bg-neutral-100 border-neutral-300 rounded focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-neutral-700 dark:text-neutral-300">Recordarme</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight size={18} />}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-neutral-800 text-neutral-500">
                o continúa con
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => AuthService.signInWithGoogle()}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              disabled
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </Card>

        {/* Register link */}
        <p className="text-center text-neutral-600 dark:text-neutral-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-semibold"
          >
            Regístrate gratis
          </Link>
        </p>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
