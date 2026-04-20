import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Award, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Course } from '@/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export default function CursoDetalle(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [curso, setCurso] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCursoDetalle();
  }, [id]);

  const fetchCursoDetalle = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Course>(
        `${API_URL}/cursos/${id}`
      );
      setCurso(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching curso:', err);
      setError('Error cargando curso. Intenta de nuevo.');
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

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error || 'Curso no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{curso.titulo}</h1>
          <p className="text-lg text-blue-100 mb-6">{curso.descripcion}</p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Clock size={24} />
              <div>
                <span className="block text-sm text-blue-100">Duración</span>
                <span className="block font-bold">{curso.duracion_horas} horas</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award size={24} />
              <div>
                <span className="block text-sm text-blue-100">Certificado</span>
                <span className="block font-bold">Incluido</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={24} />
              <div>
                <span className="block text-sm text-blue-100">Nivel</span>
                <span className="block font-bold capitalize">{curso.nivel}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
              {curso.precio > 0 ? `Comprar - €${curso.precio}` : 'Inscribirse Gratis'}
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Más Información
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Acerca del Curso
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {curso.descripcion}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Temario
          </h2>

          {curso.modulos && curso.modulos.length > 0 ? (
            <div className="space-y-6">
              {curso.modulos.map((modulo, idx) => (
                <div key={modulo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Módulo {idx + 1}: {modulo.titulo}
                    </h3>
                    <span className="text-gray-600 dark:text-gray-400">+</span>
                  </button>

                  {modulo.lecciones && modulo.lecciones.length > 0 && (
                    <div className="px-6 py-4 bg-white dark:bg-gray-900 space-y-3">
                      {modulo.lecciones.map((leccion, lecIdx) => (
                        <div key={leccion.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                          <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">
                            Lección {lecIdx + 1}
                          </span>
                          <span>{leccion.titulo}</span>
                          {leccion.duracion_minutos != null && leccion.duracion_minutos > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                              {leccion.duracion_minutos} min
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              El temario se mostrará cuando el curso esté completamente configurado.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Requisitos
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Conexión a Internet
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Navegador web actualizado
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Conocimientos básicos del sector (según el nivel del curso)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}