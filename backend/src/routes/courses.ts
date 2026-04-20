import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  togglePublish,
  deleteCourse,
} from '../controllers/courseController';
import { verifyAuth, requirePermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { courseSchema } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Admin routes
router.post('/', verifyAuth, requirePermission('course:create'), validate(courseSchema), createCourse);
router.put('/:id', verifyAuth, requirePermission('course:edit'), validate(courseSchema), updateCourse);
router.put('/:id/publicar', verifyAuth, requirePermission('course:edit'), togglePublish);
router.delete('/:id', verifyAuth, requirePermission('course:delete'), deleteCourse);

export default router;
