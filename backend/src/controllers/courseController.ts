import { Request, Response } from 'express';
import { CourseService } from '../services/CourseService';

/**
 * Course Controller - HTTP request handlers
 */

// GET /api/cursos - Listar cursos publicados (con filtros)
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nivel } = req.query;

    const result = await CourseService.getPublishedCourses({
      nivel: nivel as string | undefined,
      limit: 100,
    });

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json(result.data || []);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Error obteniendo cursos' });
  }
};

// GET /api/cursos/:id - Detalle curso
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await CourseService.getCourseById(id);

    if (!result.success) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.json(result.data!);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Error obteniendo curso' });
  }
};

// POST /api/cursos - Crear curso [ADMIN]
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await CourseService.createCourse(req.body);

    if (!result.success || !result.data) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(201).json(result.data);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Error creando curso' });
  }
};

// PUT /api/cursos/:id - Editar curso [ADMIN]
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await CourseService.updateCourse(id, req.body);

    if (!result.success || !result.data) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Error actualizando curso' });
  }
};

// PUT /api/cursos/:id/publicar - Publicar/despublicar [ADMIN]
export const togglePublish = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { publicado } = req.body;

    const result = await CourseService.togglePublish(id, publicado);

    if (!result.success || !result.data) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ error: 'Error publicando curso' });
  }
};

// DELETE /api/cursos/:id - Eliminar curso [ADMIN]
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await CourseService.deleteCourse(id);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Error eliminando curso' });
  }
};
