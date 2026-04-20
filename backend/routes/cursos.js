import express from 'express';
import { supabase } from '../server.js';
import { verifyAuth, adminOnly } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/cursos - Listar cursos publicados (con filtros)
router.get('/', async (req, res) => {
  try {
    const { nivel } = req.query;

    let query = supabase
      .from('cursos')
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true });

    if (nivel) {
      query = query.eq('nivel', nivel);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Get cursos error:', error);
    res.status(500).json({ error: 'Error obteniendo cursos' });
  }
});

// GET /api/cursos/:id - Detalle curso
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single();

    if (cursoError || !curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Obtener módulos y lecciones
    const { data: modulos } = await supabase
      .from('modulos')
      .select('*, lecciones(*)')
      .eq('curso_id', id)
      .order('orden', { ascending: true });

    res.json({
      ...curso,
      modulos: modulos || []
    });
  } catch (error) {
    console.error('Get curso detail error:', error);
    res.status(500).json({ error: 'Error obteniendo curso' });
  }
});

// POST /api/cursos - Crear curso [ADMIN]
router.post('/', verifyAuth, adminOnly, async (req, res) => {
  try {
    const { titulo, descripcion, descripcion_corta, nivel, duracion_horas, precio, categoria_id } = req.body;

    const slug = titulo.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('cursos')
      .insert({
        id: uuidv4(),
        titulo,
        slug,
        descripcion,
        descripcion_corta,
        nivel: nivel || 'basico',
        duracion_horas: duracion_horas || 0,
        precio: precio || 0,
        categoria_id,
        publicado: false
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create curso error:', error);
    res.status(500).json({ error: 'Error creando curso' });
  }
});

// PUT /api/cursos/:id - Editar curso [ADMIN]
router.put('/:id', verifyAuth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, descripcion_corta, nivel, duracion_horas, precio, categoria_id } = req.body;

    const { data, error } = await supabase
      .from('cursos')
      .update({
        titulo,
        descripcion,
        descripcion_corta,
        nivel,
        duracion_horas,
        precio,
        categoria_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update curso error:', error);
    res.status(500).json({ error: 'Error actualizando curso' });
  }
});

// PUT /api/cursos/:id/publicar - Publicar/despublicar [ADMIN]
router.put('/:id/publicar', verifyAuth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { publicado } = req.body;

    const { data, error } = await supabase
      .from('cursos')
      .update({ publicado })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Publish curso error:', error);
    res.status(500).json({ error: 'Error publicando curso' });
  }
});

// DELETE /api/cursos/:id - Eliminar curso [ADMIN]
router.delete('/:id', verifyAuth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error('Delete curso error:', error);
    res.status(500).json({ error: 'Error eliminando curso' });
  }
});

export default router;
