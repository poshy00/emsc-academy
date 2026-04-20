import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Filter, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Catalogo() {
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCursos();
  }, [filtro]);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const url = filtro
        ? `${process.env.REACT_APP_API_URL}/cursos?nivel=${filtro}`
        : `${process.env.REACT_APP_API_URL}/cursos`;
      
      const response = await axios.get(url);
      setCursos(Array.isArray(response.data) ? response.data : response.data.data || response.data.cursos || []);
      setError('');
    } catch (err) {
      console.error('Error fetching cursos:', err);
      setError('Error cargando cursos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const niveles = [
    { value: '', label: 'Todos' },
    { value: 'basico', label: 'Básico' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Catálogo de Cursos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Explora nuestros cursos especializados en agua, energía y automatización industrial.
        </p>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          {niveles.map(nivel => (
            <button
              key={nivel.value}
              onClick={() => setFiltro(nivel.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === nivel.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {nivel.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <span className="text-red-700 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Cursos Grid */}
        {!loading && (
          <>
            {cursos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No hay cursos disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map(curso => (
                  <Link
                    key={curso.id}
                    to={`/cursos/${curso.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    {/* Imagen placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold opacity-50">
                        {curso.titulo.charAt(0)}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          curso.nivel === 'basico' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          curso.nivel === 'intermedio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {curso.nivel?.charAt(0).toUpperCase() + curso.nivel?.slice(1) || 'Básico'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                        {curso.titulo}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {curso.descripcion_corta || curso.descripcion}
                      </p>

                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                        <Clock size={16} />
                        <span>{curso.duracion_horas} horas</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {curso.precio > 0 ? `€${curso.precio}` : 'Gratis'}
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                          Ver Curso
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
