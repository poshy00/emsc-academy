import api from './api';
import { Course, CourseFilters, PaginatedResponse } from '@/types';

export const CourseService = {
  /**
   * Get courses with filters and pagination
   */
  async getCourses(filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.nivel) params.append('nivel', filters.nivel);
    if (filters.precio_min !== undefined) params.append('precio_min', String(filters.precio_min));
    if (filters.precio_max !== undefined) params.append('precio_max', String(filters.precio_max));
    if (filters.calificacion_min) params.append('calificacion_min', String(filters.calificacion_min));
    if (filters.instructor) params.append('instructor', filters.instructor);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    return api.get<PaginatedResponse<Course>>(`/cursos?${params.toString()}`);
  },

  /**
   * Get single course by ID or slug
   */
  async getCourse(identifier: string): Promise<Course> {
    return api.get<Course>(`/cursos/${identifier}`);
  },

  /**
   * Get featured courses
   */
  async getFeatured(limit: number = 6): Promise<Course[]> {
    return api.get<Course[]>(`/cursos?destacado=true&limit=${limit}&order=destacado`);
  },

  /**
   * Enroll in a course
   */
  async enroll(courseId: string): Promise<{ success: boolean; message: string }> {
    return api.post(`/cursos/${courseId}/enroll`);
  },

  /**
   * Get instructor's courses
   */
  async getInstructorCourses(): Promise<Course[]> {
    return api.get<Course[]>('/instructor/cursos');
  },

  /**
   * Create new course (instructor/admin)
   */
  async createCourse(data: Partial<Course>): Promise<Course> {
    return api.post<Course>('/cursos', data);
  },

  /**
   * Update course
   */
  async updateCourse(courseId: string, data: Partial<Course>): Promise<Course> {
    return api.put<Course>(`/cursos/${courseId}`, data);
  },

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<void> {
    return api.delete(`/cursos/${courseId}`);
  },

  /**
   * Publish/unpublish course
   */
  async togglePublish(courseId: string, published: boolean): Promise<Course> {
    return api.patch<Course>(`/cursos/${courseId}/publish`, { publicado: published });
  },

  /**
   * Get course analytics (instructor)
   */
  async getCourseAnalytics(courseId: string): Promise<unknown> {
    return api.get(`/cursos/${courseId}/analytics`);
  },
};

export default CourseService;
