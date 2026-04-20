import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/estadisticas`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error cargando estadísticas');
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Panel de Administración
          </h1>
          <Link
            to="/admin/cursos"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            + Nuevo Curso
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <span className="text-red-700 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* KPIs */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Estudiantes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Total Estudiantes
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.total_estudiantes || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            {/* Ingresos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Ingresos Totales
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    €{stats.total_ingresos_eur || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            {/* Cursos Publicados */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Cursos Publicados
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.cursos_publicados || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            {/* Inscripciones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Inscripciones
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.inscripciones_total || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Users className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/cursos"
            className="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-200 mb-2">
              Gestionar Cursos
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-200">
              Crear, editar y publicar cursos
            </p>
          </Link>

          <Link
            to="/admin"
            className="p-6 bg-green-50 dark:bg-green-900 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-green-600 dark:text-green-200 mb-2">
              Ejercicios Pendientes
            </h3>
            <p className="text-sm text-green-600 dark:text-green-200">
              Ver y calificar entregas
            </p>
          </Link>

          <Link
            to="/admin"
            className="p-6 bg-purple-50 dark:bg-purple-900 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-purple-600 dark:text-purple-200 mb-2">
              Certificados
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-200">
              Emitir certificados
            </p>
          </Link>

          <Link
            to="/admin"
            className="p-6 bg-orange-50 dark:bg-orange-900 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-orange-600 dark:text-orange-200 mb-2">
              Reportes
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-200">
              Ver estadísticas y reportes
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
