import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================
export const registerSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'La contraseña es requerida'),
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100)
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ============================================
// COURSE SCHEMAS
// ============================================
export const courseSchema = z.object({
  titulo: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título es demasiado largo')
    .trim(),
  descripcion: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(5000, 'La descripción es demasiado larga'),
  descripcion_corta: z.string()
    .max(300, 'La descripción corta es demasiado larga')
    .optional(),
  nivel: z.enum(['basico', 'intermedio', 'avanzado', 'experto']),
  duracion_horas: z.number()
    .min(0.5, 'La duración mínima es 0.5 horas')
    .max(500, 'La duración máxima es 500 horas'),
  precio: z.number()
    .min(0, 'El precio no puede ser negativo')
    .max(10000, 'El precio es demasiado alto'),
  categoria_id: z.string().uuid().optional().nullable(),
  etiquetas: z.array(z.string()).max(10, 'Máximo 10 etiquetas').optional(),
  objetivos_aprendizaje: z.array(z.string()).max(10).optional(),
  requisitos: z.array(z.string()).max(10).optional(),
  publicado: z.boolean().default(false),
  destacado: z.boolean().default(false),
  imagen_principal_url: z.string().url().optional().nullable(),
  video_trailer_url: z.string().url().optional().nullable(),
});

export const updateCourseSchema = courseSchema.partial();

export const courseFilterSchema = z.object({
  search: z.string().optional(),
  categoria: z.string().uuid().optional(),
  nivel: z.enum(['basico', 'intermedio', 'avanzado', 'experto']).optional(),
  precio_min: z.number().min(0).optional(),
  precio_max: z.number().min(0).optional(),
  calificacion_min: z.number().min(1).max(5).optional(),
  instructor: z.string().optional(),
  destacado: z.boolean().optional(),
  order: z.enum(['destacado', 'recientes', 'populares', 'calificacion', 'precio_asc', 'precio_desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// ============================================
// MODULE SCHEMAS
// ============================================
export const moduleSchema = z.object({
  curso_id: z.string().uuid(),
  titulo: z.string()
    .min(3, 'El título del módulo debe tener al menos 3 caracteres')
    .max(200),
  descripcion: z.string().max(1000).optional(),
  orden: z.number().int().nonnegative(),
  es_gratuito: z.boolean().default(false),
});

export const updateModuleSchema = moduleSchema.partial();

// ============================================
// LESSON SCHEMAS
// ============================================
export const lessonSchema = z.object({
  modulo_id: z.string().uuid(),
  titulo: z.string()
    .min(3, 'El título de la lección debe tener al menos 3 caracteres')
    .max(200),
  descripcion: z.string().max(2000).optional(),
  tipo_leccion: z.enum(['video', 'texto', 'quiz', 'tarea', 'encuesta']),
  orden: z.number().int().nonnegative(),
  duracion_minutos: z.number().int().nonnegative().optional(),
  video_url: z.string().url().optional(),
  video_proveedor: z.enum(['youtube', 'vimeo', 'local', 'cloudinary']).optional(),
  es_gratis: z.boolean().default(false),
  leccion_previo_id: z.string().uuid().optional().nullable(),
  req_calificacion_minima: z.number().min(0).max(100).optional().nullable(),
});

export const updateLessonSchema = lessonSchema.partial();

// ============================================
// QUIZ SCHEMAS
// ============================================
export const quizSchema = z.object({
  leccion_id: z.string().uuid(),
  titulo: z.string().min(3).max(200),
  descripcion: z.string().max(1000).optional(),
  tiempo_limite_minutos: z.number().int().positive().optional(),
  intentos_permitidos: z.number().int().positive().default(1),
  nota_minima_aprobado: z.number().min(0).max(100).default(70),
  peso_calificacion: z.number().min(0).max(100).default(100),
  mostrar_respuestas_al_final: z.boolean().default(true),
  randomizar_preguntas: z.boolean().default(false),
  mezclar_opciones: z.boolean().default(false),
});

export const questionSchema = z.object({
  quiz_id: z.string().uuid(),
  enunciado: z.string().min(5).max(2000),
  tipo_pregunta: z.enum(['multiple_choice', 'verdadero_falso', 'respuesta_corta', 'emparejamiento', 'completar_espacios']),
  puntos: z.number().min(0).max(100).default(1),
  orden: z.number().int().nonnegative(),
  instrucciones: z.string().optional(),
  respuestas_correctas: z.array(z.unknown()).optional(),
  opciones_emparejamiento: z.array(z.unknown()).optional(),
});

export const answerOptionSchema = z.object({
  pregunta_id: z.string().uuid(),
  texto_opcion: z.string().min(1).max(500),
  es_correcta: z.boolean().default(false),
  orden: z.number().int().nonnegative(),
  puntos_parciales: z.number().min(0).max(100).optional(),
});

export const submitQuizSchema = z.object({
  respuestas: z.array(z.object({
    pregunta_id: z.string().uuid(),
    respuesta_seleccionada: z.array(z.string()).optional(),
    respuesta_texto: z.string().optional(),
  }).min(1, 'Debes responder al menos una pregunta')),
});

// ============================================
// ENROLLMENT SCHEMAS
// ============================================
export const enrollCourseSchema = z.object({
  curso_id: z.string().uuid(),
});

// ============================================
// PROGRESS SCHEMAS
// ============================================
export const updateProgressSchema = z.object({
  currentTime: z.number().min(0),
  totalTime: z.number().min(0),
  eventType: z.enum(['play', 'pause', 'seek', 'complete']),
});

// ============================================
// PAYMENT SCHEMAS
// ============================================
export const createCheckoutSessionSchema = z.object({
  curso_ids: z.array(z.string().uuid()).min(1, 'Selecciona al menos un curso'),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
});

export const webhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.unknown(),
  }),
});

// ============================================
// REVIEW SCHEMAS
// ============================================
export const createReviewSchema = z.object({
  curso_id: z.string().uuid(),
  calificacion: z.number().int().min(1).max(5),
  titulo: z.string().max(150).optional(),
  comentario: z.string().min(10).max(1000).optional(),
});

// ============================================
// USER UPDATE SCHEMAS
// ============================================
export const updateProfileSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

// ============================================
// SEARCH SCHEMAS
// ============================================
export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  tipo: z.enum(['cursos', 'lecciones', 'modulos']).optional(),
  limite: z.number().int().positive().max(50).optional(),
});

// ============================================
// COMMON
// ============================================
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

// ============================================
// UTILITY
// ============================================
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach(error => {
          const path = error.path.join('.');
          errors[path] = error.message;
        });
        next(new ValidationError(errors));
      } else {
        next(err);
      }
    }
  };
};
