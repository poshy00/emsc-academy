import { Router } from 'express';
import {
  createModulo,
  createLeccion,
  createVideo,
  createDocumento,
  getLeccion,
} from '../controllers/lessonController';
import { verifyAuth, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { moduleSchema, lessonSchema, videoSchema, documentSchema } from '../utils/validators';

const router = Router();

// All routes below require authentication
router.use(verifyAuth);

// Module routes
router.post(
  '/curso/:cursoId/modulos',
  verifyAuth,
  requirePermission('course:edit'),
  validate(moduleSchema),
  createModulo
);

// Lesson routes
router.post(
  '/modulo/:moduloId/lecciones',
  verifyAuth,
  requirePermission('course:edit'),
  validate(lessonSchema),
  createLeccion
);

// Content routes
router.post(
  '/:leccionId/videos',
  verifyAuth,
  requirePermission('course:edit'),
  validate(videoSchema),
  createVideo
);

router.post(
  '/:leccionId/documentos',
  verifyAuth,
  requirePermission('course:edit'),
  validate(documentSchema),
  createDocumento
);

// Get lesson with content
router.get('/:leccionId', verifyAuth, getLeccion);

export default router;
