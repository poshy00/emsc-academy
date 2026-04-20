import express from 'express';
import { supabase } from '../server.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/estadisticas - KPIs globales [ADMIN]
router.get('/estadisticas', adminOnly, async (req, res) => {
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
      ejercicios_pendientes_calificar: 0
    });
  } catch (error) {
    console.error('Get estadisticas error:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// GET /api/admin/estudiantes - Listar estudiantes [ADMIN]
router.get('/estudiantes', adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('rol', 'estudiante');

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Get estudiantes error:', error);
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
});

// GET /api/admin/pagos - Historial pagos [ADMIN]
router.get('/pagos', adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, users(nombre, email), cursos(titulo)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Get pagos error:', error);
    res.status(500).json({ error: 'Error obteniendo pagos' });
  }
});

// GET /api/admin/cursos - Todos los cursos [ADMIN]
router.get('/cursos', adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('orden');

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Get admin cursos error:', error);
    res.status(500).json({ error: 'Error obteniendo cursos' });
  }
});

export default router;
