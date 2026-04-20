import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
    permisos?: string[];
  };
}

// In-memory cache for user permissions (Redis recommended in production)
const permissionCache = new Map<string, { user: AuthenticatedRequest['user']; expires: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Verify JWT token and attach user to request
 * Uses Supabase JWT verification (symmetric with service role key)
 */
export async function verifyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        error: { 
          code: 401, 
          message: 'Token de autenticación requerido' 
        } 
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT using Supabase's JWT secret (from JWT_SECRET env)
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: { 
            code: 401, 
            message: 'Token expirado' 
          } 
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 401, 
          message: 'Token inválido' 
        } 
      });
    }

    const userId = payload.sub;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 401, 
          message: 'Token mal formado' 
        } 
      });
    }

    // Check cache first
    const cacheKey = `user:${userId}`;
    const cached = permissionCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      req.user = cached.user;
      return next();
    }

    // Fetch user from Supabase with role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, nombre, rol, permisos')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      // Token valid but user not found - possible deleted account
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 401, 
          message: 'Usuario no encontrado' 
        } 
      });
    }

    // Attach user to request
    req.user = {
      id: userData.id,
      email: userData.email,
      rol: userData.rol,
      permisos: userData.permisos as string[] | undefined,
    };

    // Cache user data
    permissionCache.set(cacheKey, {
      user: req.user,
      expires: Date.now() + CACHE_TTL,
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 500, 
        message: 'Error interno de autenticación' 
      } 
    });
  }
}

/**
 * Permission checking middleware
 * Permission format: "resource:action" (e.g., "course:create")
 */
export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: { code: 401, message: 'Usuario no autenticado' } 
        });
      }

      // Admin has all permissions (short-circuit)
      if (req.user.rol === 'admin') {
        return next();
      }

      // Check explicit permissions array (for granular control)
      const userPermissions = req.user.permisos || [];
      if (userPermissions.includes(permission) || userPermissions.includes('*')) {
        return next();
      }

      // Role-based permission mapping
      const rolePermissions: Record<string, string[]> = {
        instructor: [
          'course:view',
          'course:edit_own',
          'course:create',
          'lesson:create',
          'lesson:edit',
          'content:upload',
          'enrollment:view_own',
          'quiz:create',
          'quiz:grade',
          'assignment:grade',
          'analytics:view_own',
        ],
        estudiante: [
          'course:view',
          'enrollment:create',
          'lesson:view',
          'quiz:take',
          'assignment:submit',
          'progress:view_own',
        ],
      };

      const allowedPermissions = rolePermissions[req.user.rol] || [];

      if (allowedPermissions.includes(permission)) {
        return next();
      }

      // Check wildcards (e.g., "course:*")
      const [resource, action] = permission.split(':');
      const wildcardPermission = `${resource}:*`;
      if (userPermissions.includes(wildcardPermission) || allowedPermissions.includes(wildcardPermission)) {
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 403, 
          message: 'Acceso denegado - Permisos insuficientes',
          required: permission,
          userRole: req.user.rol
        } 
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        success: false, 
        error: { code: 500, message: 'Error verificando permisos' } 
      });
    }
  };
}

/**
 * Middleware that requires admin role
 */
export async function adminOnly(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 401, message: 'Usuario no autenticado' } 
      });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: { code: 403, message: 'Acceso denegado - Solo administradores' } 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { code: 500, message: 'Error verificando permisos' } 
    });
  }
}

/**
 * Optional auth - attaches user if token provided, but doesn't require it
 */
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token, continue as guest
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    
    // Try to fetch user but don't fail if not found
    const { data: userData } = await supabase
      .from('users')
      .select('id, email, nombre, rol')
      .eq('id', payload.sub)
      .single();

    if (userData) {
      req.user = {
        id: userData.id,
        email: userData.email,
        rol: userData.rol,
      };
    }
  } catch (error) {
    // Invalid token, continue as guest (don't error)
    console.debug('Optional auth failed:', error);
  }

  next();
}

/**
 * Clear permission cache for a user (call on role change)
 */
export function clearUserCache(userId: string): void {
  permissionCache.delete(`user:${userId}`);
}

/**
 * Get cached user data
 */
export function getCachedUser(userId: string): AuthenticatedRequest['user'] | undefined {
  const cached = permissionCache.get(`user:${userId}`);
  if (cached && cached.expires > Date.now()) {
    return cached.user;
  }
  return undefined;
}

