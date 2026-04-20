import { Router } from 'express';
import {
  createPaymentSession,
  stripeWebhook,
} from '../controllers/paymentController';
import { verifyAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { paymentSchema } from '../utils/validators';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protected routes - require auth
router.use(verifyAuth);

// Create payment session
router.post('/crear-sesion', paymentLimiter, validate(paymentSchema), createPaymentSession);

export default router;

// Webhook route (exported separately in server.ts)
export const webhookRouter = Router();
webhookRouter.post('/webhook-stripe', stripeWebhook);
