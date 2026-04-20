import { Router } from 'express';
import {
  getEstadisticas,
  getEstudiantes,
  getPagos,
  getAdminCursos,
} from '../controllers/adminController';
import { verifyAuth, adminOnly } from '../middleware/auth';

const router = Router();

// All admin routes require authentication + admin role
router.use(verifyAuth, adminOnly);

// Statistics
router.get('/estadisticas', getEstadisticas);

// Estudiantes list
router.get('/estudiantes', getEstudiantes);

// Payment history
router.get('/pagos', getPagos);

// All courses (admin view)
router.get('/cursos', getAdminCursos);

export default router;
