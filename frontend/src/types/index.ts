export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'instructor' | 'estudiante';
  avatar_url?: string | null;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  es_verificado?: boolean;
  idioma?: string;
  zona_horaria?: string;
  // Instructor fields
  titulo_profesional?: string;
  experiencia_anios?: number;
  especialidades?: string[];
  calificacion_promedio?: number;
  total_reviews?: number;
  // Student fields
  pais?: string;
  fecha_nacimiento?: string;
  // Metadata
  metadata?: Record<string, unknown>;
  created_at?: string;
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
  orden?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  instructor_id: string;
  instructor?: User;
  categoria_id?: string | null;
  categoria?: Category;
  precio: number;
  moneda?: string;
  precio_descuento?: number | null;
  fecha_oferta_fin?: string | null;
  nivel: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  etiquetas?: string[];
  idioma?: string;
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
  meta_title?: string;
  meta_description?: string;
  // Denormalized stats
  total_inscripciones?: number;
  total_completados?: number;
  calificacion_promedio?: number;
  total_reseñas?: number;
  // Advanced
  tiene_certificado?: boolean;
  certificado_tipo?: 'automatico' | 'manual';
  politica_devolucion_dias?: number;
  es_gratuito?: boolean;
  modulos?: Module[];
  created_at?: string;
  updated_at?: string;
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
  numero_lecciones?: number;
  lecciones?: Lesson[];
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  modulo_id: string;
  titulo: string;
  descripcion?: string;
  tipo_leccion: 'video' | 'texto' | 'quiz' | 'tarea' | 'encuesta';
  orden: number;
  duracion_minutos?: number;
  duracion_segundos?: number;
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
  total_visualizaciones?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LessonWithRelations extends Lesson {
  videos: Video[];
  documentos: Document[];
  quiz?: Quiz;
  tarea?: Assignment;
}

export interface Video {
  id: string;
  leccion_id: string;
  titulo: string;
  tipo: 'youtube' | 'vimeo' | 'local' | 'cloudinary';
  url: string;
  duracion_segundos?: number;
  orden?: number;
  created_at?: string;
}

export interface Document {
  id: string;
  leccion_id: string;
  titulo: string;
  descripcion?: string;
  file_url: string;
  file_type?: string;
  file_size_bytes?: number;
  orden?: number;
  created_at?: string;
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
  total_tiempo_visto_segundos?: number;
  curso?: Course;
  user?: User;
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
  created_at?: string;
  updated_at?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  leccion_id: string;
  titulo: string;
  descripcion?: string;
  tiempo_limite_minutos?: number;
  intentos_permitidos: number;
  nota_minima_aprobado: number;
  peso_calificacion: number;
  mostrar_respuestas_al_final: boolean;
  randomizar_preguntas: boolean;
  mezclar_opciones: boolean;
  activo: boolean;
  preguntas?: QuizQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  enunciado: string;
  tipo_pregunta: 'multiple_choice' | 'verdadero_falso' | 'respuesta_corta' | 'emparejamiento' | 'completar_espacios';
  puntos: number;
  orden: number;
  instrucciones?: string;
  retroalimentacion_correcta?: string;
  retroalimentacion_incorrecta?: string;
  respuestas_correctas?: Record<string, unknown>[];
  opciones_emparejamiento?: Record<string, unknown>[];
  opciones?: AnswerOption[];
  created_at?: string;
}

export interface AnswerOption {
  id: string;
  pregunta_id: string;
  texto_opcion: string;
  es_correcta: boolean;
  orden: number;
  puntos_parciales?: number;
}

export interface QuizSubmission {
  leccion_id: string;
  respuestas: Array<{
    pregunta_id: string;
    respuesta_seleccionada?: string[];
    respuesta_texto?: string;
  }>;
}

export interface QuizResult {
  quiz_id: string;
  nota_obtenida: number;
  aprobado: boolean;
  intento_numero: number;
  respuestas_correctas: number;
  respuestas_incorrectas: number;
  fecha_respuesta: string;
  detalle_respuestas: Array<{
    pregunta_id: string;
    correcta: boolean;
    puntos_obtenidos: number;
    respuesta_usuario: unknown;
  }>;
}

// Assignment Types
export interface Assignment {
  id: string;
  leccion_id: string;
  titulo: string;
  descripcion: string;
  instrucciones?: string;
  tipos_archivo_permitidos: string;
  max_file_size_mb: number;
  es_obligatorio: boolean;
  activo: boolean;
  created_at?: string;
}

export interface AssignmentSubmission {
  id: string;
  tarea_id: string;
  estudiante_id: string;
  file_url: string;
  file_name: string;
  comentario_estudiante?: string;
  estado: 'pendiente' | 'calificado' | 'devuelto';
  nota?: number;
  comentario_admin?: string;
  fecha_entrega: string;
  fecha_calificacion?: string;
}

// Review Types
export interface Review {
  id: string;
  curso_id: string;
  estudiante_id: string;
  calificacion: 1 | 2 | 3 | 4 | 5;
  titulo?: string;
  comentario?: string;
  util: number;
  resena_verificada: boolean;
  respuesta_instructor?: string;
  fecha_respuesta?: string;
  created_at?: string;
  updated_at?: string;
  estudiante?: User;
}

// Notification Types
export interface Notification {
  id: string;
  usuario_id: string;
  tipo: 'inscripcion_confirmada' | 'leccion_completada' | 'curso_completado' | 
        'certificado_disponible' | 'respuesta_foro' | 'mencion' | 
        'recordatorio_inactivo' | 'ofertas_promocionales' | 'mantenimiento_sistema';
  canal: 'email' | 'in_app' | 'push' | 'sms';
  titulo: string;
  mensaje: string;
  datos?: Record<string, unknown>;
  leida: boolean;
  fecha_leida?: string;
  entregada: boolean;
  fecha_entregada?: string;
  accion_tipo?: string;
  accion_url?: string;
  programada_para?: string;
  fecha_expiracion?: string;
  prioridad: number;
  created_at?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  id?: string;
  usuario_id?: string | null;
  session_id: string;
  evento: string;
  categoria?: string;
  accion?: string;
  propiedades?: Record<string, unknown>;
  url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  pais_codigo?: string;
  dispositivo?: 'desktop' | 'tablet' | 'mobile';
  navegador?: string;
  timestamp?: string;
}

// Admin Types
export interface AdminDashboardStats {
  total_ingresos: number;
  ingresos_mensuales: number;
  total_estudiantes: number;
  estudiantes_activos: number;
  total_cursos: number;
  cursos_publicados: number;
  total_inscripciones: number;
  tasa_completacion: number;
}

export interface CourseStudent {
  id: string;
  user: User;
  progreso: number;
  fecha_inscripcion: string;
  ultimo_acceso?: string;
  calificacion_final?: number;
  certificado_emitido: boolean;
}

// Auth Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: unknown;
  };
  timestamp: string;
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

// Filter Types
export interface CourseFilters {
  search?: string;
  categoria?: string;
  nivel?: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  precio_min?: number;
  precio_max?: number;
  calificacion_min?: number;
  instructor?: string;
  order?: 'destacado' | 'recientes' | 'populares' | 'calificacion' | 'precio_asc' | 'precio_desc';
  page?: number;
  limit?: number;
}

// Certificate Types
export interface Certificate {
  id: string;
  estudiante_id: string;
  curso_id: string;
  curso_titulo: string;
  instructor_nombre: string;
  numero_certificado: string;
  nota_final: number;
  fecha_emision: string;
  pdf_url: string;
  hash_verificacion: string;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}
