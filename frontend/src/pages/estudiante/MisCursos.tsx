import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart3, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Enrollment } from '@/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export default function MisCursos(): React.ReactElement {
  const [cursos, setCursos] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchMisCursos();
  }, []);

  const fetchMisCursos = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Enrollment[]>(
        `${API_URL}/mis-cursos`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCursos(response.data || []);
    } catch (err) {
      console.error('Error fetching cursos:', err);
      setError('Error cargando tus cursos');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Mis Cursos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Continúa aprendiendo desde donde lo dejaste.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <span className="text-red-700 dark:text-red-200">{error}</span>
          </div>
        )}

        {cursos.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Aún no estás inscrito en ningún curso
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explora nuestro catálogo y comienza a aprender hoy.
            </p>
            <Link
              to="/catalogo"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(inscripcion => (
              <div
                key={inscripcion.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-50" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {inscripcion.course?.titulo || 'Curso'}
                  </h3>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progreso
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${inscripcion.porcentaje_progreso || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {inscripcion.porcentaje_progreso || 0}% completado
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Inscrito el {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}
                  </div>

                  <Link
                    to={`/cursos/${inscripcion.curso_id}/lecciones`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                  >
                    Continuar Aprendiendo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}