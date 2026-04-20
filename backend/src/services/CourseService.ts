import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import {
  Course,
  CreateCoursePayload,
  UpdateCoursePayload,
  ServiceResult,
  PaginatedResponse,
} from '../types';

/**
 * Course Service - Business logic for course management
 */
export class CourseService {
  /**
   * Get all published courses with optional filtering
   */
  static async getPublishedCourses(filters?: {
    nivel?: string;
    categoria_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<Course[]>> {
    try {
      let query = supabase
        .from('cursos')
        .select('*')
        .eq('publicado', true)
        .order('orden', { ascending: true });

      if (filters?.nivel) {
        query = query.eq('nivel', filters.nivel);
      }

      if (filters?.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Error obteniendo cursos' };
    }
  }

  /**
   * Get course by ID with modules and lessons
   */
  static async getCourseById(id: string): Promise<ServiceResult<Course & { modulos: any[] }>> {
    try {
      const { data: curso, error: cursoError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', id)
        .single();

      if (cursoError || !curso) {
        return { success: false, error: 'Curso no encontrado' };
      }

      const { data: modulos } = await supabase
        .from('modulos')
        .select('*, lecciones(*)')
        .eq('curso_id', id)
        .order('orden', { ascending: true });

      return { success: true, data: { ...curso, modulos: modulos || [] } };
    } catch (error) {
      return { success: false, error: 'Error obteniendo curso' };
    }
  }

  /**
   * Create a new course (admin only)
   */
  static async createCourse(payload: CreateCoursePayload): Promise<ServiceResult<Course>> {
    try {
      const slug = this.generateSlug(payload.titulo);

      const { data, error } = await supabase
        .from('cursos')
        .insert({
          id: uuidv4(),
          titulo: payload.titulo,
          slug,
          descripcion: payload.descripcion,
          descripcion_corta: payload.descripcion_corta,
          nivel: payload.nivel,
          duracion_horas: payload.duracion_horas,
          precio: payload.precio,
          categoria_id: payload.categoria_id,
          publicado: false,
          orden: 0,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error creando curso' };
    }
  }

  /**
   * Update course (admin only)
   */
  static async updateCourse(id: string, payload: UpdateCoursePayload): Promise<ServiceResult<Course>> {
    try {
      const updateData: Record<string, any> = { ...payload, updated_at: new Date().toISOString() };

      const { data, error } = await supabase
        .from('cursos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error actualizando curso' };
    }
  }

  /**
   * Publish/unpublish course (admin only)
   */
  static async togglePublish(id: string, publicado: boolean): Promise<ServiceResult<Course>> {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .update({ publicado })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Error actualizando estado del curso' };
    }
  }

  /**
   * Delete course (admin only)
   */
  static async deleteCourse(id: string): Promise<ServiceResult<null>> {
    try {
      const { error } = await supabase.from('cursos').delete().eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error eliminando curso' };
    }
  }

  /**
   * Get course count
   */
  static async getCount(publishedOnly = false): Promise<ServiceResult<number>> {
    try {
      let query = supabase.from('cursos').select('*', { count: 'exact', head: true });

      if (publishedOnly) {
        query = query.eq('publicado', true);
      }

      const { count, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: count || 0 };
    } catch (error) {
      return { success: false, error: 'Error contando cursos' };
    }
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
