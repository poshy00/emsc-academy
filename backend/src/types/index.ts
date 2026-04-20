import { Request } from 'express';
import { User as SupabaseUser } from '@supabase/supabase-js';

// ============================================
// EXPRESS EXTENSIONS
// ============================================
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'instructor' | 'estudiante';
  permisos?: string[];
}

// ============================================
// ERROR CLASSES
// ============================================
export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, statusCode: number = 500, code?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud inválida', code?: string, details?: unknown) {
    super(message, 400, code, details);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado', code?: string) {
    super(message, 401, code);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado', code?: string) {
    super(message, 403, code);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto en la operación') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(public errors: Record<string, string>) {
    super('Error de validación', 422, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

// ============================================
// DATABASE MODELS
// ============================================
export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'instructor' | 'estudiante';
  avatar_url?: string | null;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  es_verificado: boolean;
  idioma?: string;
  zona_horaria?: string;
  titulo_profesional?: string;
  experiencia_anios?: number;
  especialidades?: string[];
  calificacion_promedio?: number;
  total_reviews?: number;
  pais?: string;
  fecha_nacimiento?: string;
  permisos?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono_url?: string;
  imagen_url?: string;
  color_hex?: string;
  parent_id?: string | null;
  orden: number;
  activo: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  instructor_id: string;
  instructor?: Pick<User, 'id' | 'nombre' | 'avatar_url' | 'calificacion_promedio'>;
  categoria_id?: string | null;
  categoria?: Pick<Category, 'id' | 'nombre' | 'slug'>;
  precio: number;
  moneda: string;
  precio_descuento?: number | null;
  fecha_oferta_fin?: string | null;
  nivel: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  etiquetas?: string[];
  idioma: string;
  duracion_horas: number;
  numero_lecciones: number;
  imagen_principal_url?: string;
  imagen_secundaria_url?: string;
  video_trailer_url?: string;
  requisitos?: string[];
  objetivos_aprendizaje?: string[];
  publico_objetivo?: string;
  publicado: boolean;
  destacado: boolean;
  orden: number;
  fecha_publicacion?: string;
  total_inscripciones: number;
  total_completados: number;
  calificacion_promedio: number;
  total_reseñas: number;
  tiene_certificado: boolean;
  politica_devolucion_dias: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  curso_id: string;
  titulo: string;
  descripcion?: string;
  descripcion_corta?: string;
  icono_url?: string;
  orden: number;
  es_gratuito: boolean;
  tiempo_estimado_minutos?: number;
  req_modulo_previo_id?: string | null;
  numero_lecciones: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  modulo_id: string;
  titulo: string;
  descripcion?: string;
  tipo_leccion: 'video' | 'texto' | 'quiz' | 'tarea' | 'encuesta';
  orden: number;
  duracion_minutos: number;
  duracion_segundos: number;
  es_gratis: boolean;
  video_url?: string;
  video_proveedor?: 'youtube' | 'vimeo' | 'local' | 'cloudinary';
  transcript_url?: string;
  documento_url?: string;
  quiz_id?: string | null;
  tarea_id?: string | null;
  leccion_previo_id?: string | null;
  req_calificacion_minima?: number | null;
  reglas_completado?: Record<string, unknown>;
  total_visualizaciones: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  leccion_id: string;
  titulo: string;
  tipo: 'youtube' | 'vimeo' | 'local' | 'cloudinary';
  url: string;
  duracion_segundos: number;
  orden: number;
  created_at: string;
}

export interface Document {
  id: string;
  leccion_id: string;
  titulo: string;
  descripcion?: string;
  file_url: string;
  file_type?: string;
  file_size_bytes?: number;
  orden: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  estudiante_id: string;
  curso_id: string;
  fecha_inscripcion: string;
  fecha_completado?: string;
  estado: 'activa' | 'cancelada' | 'completada' | 'expirada';
  porcentaje_progreso: number;
  leccion_actual_id?: string | null;
  modulo_actual_id?: string | null;
  calificacion_final?: number;
  certificado_emitido: boolean;
  certificado_url?: string;
  fecha_certificado?: string;
  stripe_payment_intent_id?: string;
  monto_pagado: number;
  moneda: string;
  metodo_pago?: string;
  fecha_ultimo_acceso?: string;
  total_tiempo_visto_segundos: number;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  estudiante_id: string;
  leccion_id: string;
  inscripcion_id?: string;
  completada: boolean;
  fecha_completado?: string;
  tiempo_visto_segundos: number;
  tiempo_total_segundos: number;
  porcentaje_visto: number;
  quiz_intentos: number;
  quiz_nota_maxima?: number;
  quiz_nota_promedio?: number;
  tarea_entregada: boolean;
  tarea_calificada: boolean;
  tarea_nota?: number;
  tarea_fecha_entrega?: string;
  veces_accedida: number;
  fecha_ultimo_acceso: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// API PAYLOADS
// ============================================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  rol?: 'estudiante' | 'instructor';
}

export interface CreateCoursePayload {
  titulo: string;
  descripcion: string;
  descripcion_corta?: string;
  nivel: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  duracion_horas: number;
  precio: number;
  categoria_id?: string;
  etiquetas?: string[];
  objetivos_aprendizaje?: string[];
  requisitos?: string[];
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  publicado?: boolean;
  destacado?: boolean;
}

export interface CreateModulePayload {
  curso_id: string;
  titulo: string;
  descripcion?: string;
  orden: number;
  es_gratuito?: boolean;
}

export interface CreateLessonPayload {
  modulo_id: string;
  titulo: string;
  descripcion?: string;
  tipo_leccion: 'video' | 'texto' | 'quiz' | 'tarea';
  orden: number;
  duracion_minutos?: number;
  video_url?: string;
  video_proveedor?: string;
  es_gratis?: boolean;
}

// ============================================
// API RESPONSES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: unknown;
  };
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// FILTERS & QUERY
// ============================================
export interface CourseFilters {
  search?: string;
  categoria?: string;
  nivel?: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  precio_min?: number;
  precio_max?: number;
  calificacion_min?: number;
  instructor?: string;
  destacado?: boolean;
  order?: 'destacado' | 'recientes' | 'populares' | 'calificacion' | 'precio_asc' | 'precio_desc';
  page?: number;
  limit?: number;
}

// ============================================
// HEALTH CHECK
// ============================================
export interface HealthCheckResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
  uptime: number;
  services: {
    database: 'up' | 'down';
    redis?: 'up' | 'down';
  };
}

