import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterPayload, LoginPayload } from '../types';
import { registerSchema, loginSchema } from '../utils/validators';

/**
 * Auth Controller - HTTP request handlers
 */

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Datos inválidos', details: validation.error.errors });
      return;
    }

    const payload: RegisterPayload = validation.data;
    const result = await AuthService.register(payload);

    if (!result.success || !result.data) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(201).json({
      message: 'Registro exitoso',
      user: result.data.user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error en registro' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Datos inválidos', details: validation.error.errors });
      return;
    }

    const payload: LoginPayload = validation.data;
    const result = await AuthService.login(payload);

    if (!result.success || !result.data) {
      res.status(401).json({ error: result.error });
      return;
    }

    res.json({
      token: result.data.token,
      user: result.data.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await AuthService.getProfile(userId);

    if (!result.success || !result.data) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};
