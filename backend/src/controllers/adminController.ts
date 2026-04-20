import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

/**
 * Admin Controller - Admin panel endpoints
 */

// GET /api/admin/estadisticas - KPIs globales [ADMIN]
export const getEstadisticas = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total estudiantes
    const { count: totalEstudiantes } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'estudiante');

    // Total ingresos
    const { data: pagos } = await supabase
      .from('pagos')
      .select('monto_total')
      .eq('estado', 'completado');

    const totalIngresos = pagos?.reduce((sum, p) => sum + parseFloat(p.monto_total), 0) || 0;

    // Cursos publicados
    const { count: cursosPublicados } = await supabase
      .from('cursos')
      .select('*', { count: 'exact', head: true })
      .eq('publicado', true);

    // Inscripciones
    const { count: inscripcionesTotal } = await supabase
      .from('inscripciones_estudiantes')
      .select('*', { count: 'exact', head: true });

    res.json({
      total_estudiantes: totalEstudiantes || 0,
      total_ingresos_eur: Math.round(totalIngresos * 100) / 100,
      cursos_publicados: cursosPublicados || 0,
      inscripciones_total: inscripcionesTotal || 0,
      ejercicios_pendientes_calificar: 0,
    });
  } catch (error) {
    console.error('Get estadisticas error:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};

// GET /api/admin/estudiantes - Listar estudiantes [ADMIN]
export const getEstudiantes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('rol', 'estudiante');

    if (error) {
      res.status(500).json({ error: 'Error obteniendo estudiantes' });
      return;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Get estudiantes error:', error);
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
};

// GET /api/admin/pagos - Historial pagos [ADMIN]
export const getPagos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, users(nombre, email), cursos(titulo)')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Error obteniendo pagos' });
      return;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Get pagos error:', error);
    res.status(500).json({ error: 'Error obteniendo pagos' });
  }
};

// GET /api/admin/cursos - Todos los cursos [ADMIN]
export const getAdminCursos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('orden');

    if (error) {
      res.status(500).json({ error: 'Error obteniendo cursos' });
      return;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Get admin cursos error:', error);
    res.status(500).json({ error: 'Error obteniendo cursos' });
  }
};
