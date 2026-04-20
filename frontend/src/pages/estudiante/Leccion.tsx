import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, FileText, Video, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { LessonWithRelations, User } from '@/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface LeccionProps {
  user: User | null;
}

export default function Leccion({ user }: LeccionProps): React.ReactElement {
  const { leccionId } = useParams<{ leccionId: string }>();
  const [leccion, setLeccion] = useState<LessonWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [completada, setCompletada] = useState<boolean>(false);

  useEffect(() => {
    if (leccionId) {
      fetchLeccion();
    }
  }, [leccionId]);

  const fetchLeccion = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<LessonWithRelations>(
        `${API_URL}/lecciones/${leccionId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLeccion(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leccion:', err);
      setError('Error cargando la lección');
    } finally {
      setLoading(false);
    }
  };

  const marcarCompletada = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/lecciones/${leccionId}/completar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCompletada(true);
    } catch (err) {
      console.error('Error marking leccion complete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !leccion) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error || 'Lección no encontrada'}</p>
        </div>
      </div>
    );
  }

  const primerVideo = leccion.videos && leccion.videos.length > 0 ? leccion.videos[0] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {leccion.titulo}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {leccion.descripcion}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {primerVideo ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Video size={24} />
                  {primerVideo.titulo}
                </h2>

                {primerVideo.tipo === 'youtube' ? (
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${primerVideo.url}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      title={primerVideo.titulo}
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Vídeo alojado internamente
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {leccion.documentos && leccion.documentos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={24} />
                  Materiales
                </h2>

                <div className="space-y-3">
                  {leccion.documentos.map(doc => (
                    <div
                      key={doc.id}
                      className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {doc.titulo}
                        </p>
                        {doc.descripcion && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doc.descripcion}
                          </p>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-6">
              {completada ? (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle size={24} />
                  <div>
                    <p className="font-bold">Completada</p>
                    <p className="text-sm">¡Excelente trabajo!</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={marcarCompletada}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Marcar como Completada
                </button>
              )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Información de la Lección
              </h3>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {leccion.duracion_minutos != null && leccion.duracion_minutos > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Duración
                    </p>
                    <p>{leccion.duracion_minutos} minutos</p>
                  </div>
                )}

                {leccion.videos && leccion.videos.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Vídeos
                    </p>
                    <p>{leccion.videos.length} vídeo(s)</p>
                  </div>
                )}

                {leccion.documentos && leccion.documentos.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Documentos
                    </p>
                    <p>{leccion.documentos.length} archivo(s)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}