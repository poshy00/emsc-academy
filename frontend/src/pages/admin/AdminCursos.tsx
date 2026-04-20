import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { User, Course, CourseFormData } from '@/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface AdminCursosProps {
  user: User | null;
}

const initialFormData: CourseFormData = {
  titulo: '',
  descripcion: '',
  descripcion_corta: '',
  nivel: 'basico',
  duracion_horas: 0,
  precio: 0
};

export default function AdminCursos({ user }: AdminCursosProps): React.ReactElement {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Course[]>(
        `${API_URL}/admin/cursos`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCursos(response.data || []);
    } catch (err) {
      console.error('Error fetching cursos:', err);
      setError('Error cargando cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/cursos/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/cursos`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchCursos();
    } catch (err) {
      setError(err && typeof err === 'object' && 'response' in err 
        ? (err.response as { data?: { error?: string } })?.data?.error || 'Error guardando curso'
        : 'Error guardando curso');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${API_URL}/cursos/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCursos();
      } catch (err) {
        setError('Error eliminando curso');
      }
    }
  };

  const handleEdit = (curso: Course): void => {
    setEditingId(curso.id);
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      descripcion_corta: curso.descripcion_corta || '',
      nivel: curso.nivel,
      duracion_horas: curso.duracion_horas,
      precio: curso.precio
    });
    setShowForm(true);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Gestión de Cursos
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData(initialFormData);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nuevo Curso
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <span className="text-red-700 dark:text-red-200">{error}</span>
          </div>
        )}

        {showForm && (
          <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? 'Editar Curso' : 'Nuevo Curso'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título del curso"
                  value={formData.titulo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={formData.nivel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, nivel: e.target.value as 'basico' | 'intermedio' | 'avanzado' })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              ></textarea>

              <textarea
                placeholder="Descripción corta (para catálogo)"
                value={formData.descripcion_corta}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, descripcion_corta: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              ></textarea>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Duración (horas)"
                  value={formData.duracion_horas}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duracion_horas: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Precio (€)"
                  value={formData.precio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {cursos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No hay cursos creados aún.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-900 dark:text-white font-semibold">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-gray-900 dark:text-white font-semibold">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-gray-900 dark:text-white font-semibold">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-gray-900 dark:text-white font-semibold">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-gray-900 dark:text-white font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cursos.map(curso => (
                  <tr key={curso.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {curso.titulo}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 capitalize">
                      {curso.nivel}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      €{curso.precio}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        curso.publicado
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {curso.publicado ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(curso)}
                        className="inline-block p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(curso.id)}
                        className="inline-block p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition ml-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}