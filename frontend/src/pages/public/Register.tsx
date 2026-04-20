import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { createClient, SupabaseClient, AuthError } from '@supabase/supabase-js';
import { User } from '@/types';

const supabase: SupabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

interface RegisterProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Register({ setUser }: RegisterProps): React.ReactElement {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          nombre,
          rol: 'estudiante'
        });

        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : (err instanceof Error ? err.message : 'Error en registro. Intenta de nuevo.');
      setError(errorMessage);
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Crear Cuenta
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-600" />
              <span className="text-red-700 dark:text-red-200">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              <span className="text-green-700 dark:text-green-200">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-900 dark:text-white font-medium mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white font-medium mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}