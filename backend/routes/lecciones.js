import express from 'express';
import { supabase } from '../server.js';
import { adminOnly } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /api/lecciones/curso/:cursoId/modulos - Crear módulo [ADMIN]
router.post('/curso/:cursoId/modulos', adminOnly, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const { titulo, descripcion } = req.body;

    const { data, error } = await supabase
      .from('modulos')
      .insert({
        id: uuidv4(),
        curso_id: cursoId,
        titulo,
        descripcion,
        orden: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create modulo error:', error);
    res.status(500).json({ error: 'Error creando módulo' });
  }
});

// POST /api/lecciones/modulo/:moduloId/lecciones - Crear lección [ADMIN]
router.post('/modulo/:moduloId/lecciones', adminOnly, async (req, res) => {
  try {
    const { moduloId } = req.params;
    const { titulo, descripcion, duracion_minutos } = req.body;

    const { data, error } = await supabase
      .from('lecciones')
      .insert({
        id: uuidv4(),
        modulo_id: moduloId,
        titulo,
        descripcion,
        duracion_minutos: duracion_minutos || 0,
        orden: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create leccion error:', error);
    res.status(500).json({ error: 'Error creando lección' });
  }
});

// POST /api/lecciones/:leccionId/videos - Crear video [ADMIN]
router.post('/:leccionId/videos', adminOnly, async (req, res) => {
  try {
    const { leccionId } = req.params;
    const { titulo, tipo, url, duracion_segundos } = req.body;

    const { data, error } = await supabase
      .from('videos')
      .insert({
        id: uuidv4(),
        leccion_id: leccionId,
        titulo,
        tipo,
        url,
        duracion_segundos: duracion_segundos || 0,
        orden: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ error: 'Error creando video' });
  }
});

// POST /api/lecciones/:leccionId/documentos - Crear documento [ADMIN]
router.post('/:leccionId/documentos', adminOnly, async (req, res) => {
  try {
    const { leccionId } = req.params;
    const { titulo, descripcion, file_url, file_type, file_size_bytes } = req.body;

    const { data, error } = await supabase
      .from('documentos')
      .insert({
        id: uuidv4(),
        leccion_id: leccionId,
        titulo,
        descripcion,
        file_url,
        file_type,
        file_size_bytes: file_size_bytes || 0,
        orden: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create documento error:', error);
    res.status(500).json({ error: 'Error creando documento' });
  }
});

// GET /api/lecciones/:leccionId - Obtener lección completa con contenido
router.get('/:leccionId', async (req, res) => {
  try {
    const { leccionId } = req.params;

    const { data: leccion, error: leccionError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', leccionId)
      .single();

    if (leccionError || !leccion) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    // Obtener videos
    const { data: videos } = await supabase
      .from('videos')
      .select('*')
      .eq('leccion_id', leccionId)
      .order('orden');

    // Obtener documentos
    const { data: documentos } = await supabase
      .from('documentos')
      .select('*')
      .eq('leccion_id', leccionId)
      .order('orden');

    res.json({
      ...leccion,
      videos: videos || [],
      documentos: documentos || []
    });
  } catch (error) {
    console.error('Get leccion error:', error);
    res.status(500).json({ error: 'Error obteniendo lección' });
  }
});

export default router;
