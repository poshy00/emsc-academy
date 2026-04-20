import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../utils/validators';
import { verifyAuth } from '../middleware/auth';

const router = Router();

// Public routes - rate limited
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// Protected route
router.get('/me', verifyAuth, getMe);

export default router;
