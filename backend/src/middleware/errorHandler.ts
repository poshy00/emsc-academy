import { Request, Response, NextFunction } from 'express';

// Custom error classes for proper HTTP status codes
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
    
    // Maintain proper stack trace
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

/**
 * Central error handling middleware
 * MUST be the last middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let errorCode: string | undefined;
  let details: unknown = undefined;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.code;
    details = err.details;
  } 
  // Handle validation errors from express-validator or zod
  else if (err.name === 'ZodError') {
    statusCode = 422;
    message = 'Error de validación de datos';
    errorCode = 'VALIDATION_ERROR';
    details = err;
  } 
  // Handle duplicate key errors (MongoDB, PostgreSQL)
  else if (err.message?.includes('duplicate key')) {
    statusCode = 409;
    message = 'El recurso ya existe';
    errorCode = 'DUPLICATE_KEY';
  } 
  // Handle not found errors
  else if (err.message?.includes('not found') || err.message?.includes('no found')) {
    statusCode = 404;
    message = 'Recurso no encontrado';
    errorCode = 'NOT_FOUND';
  } 
  // Handle cast errors (invalid ID format)
  else if (err.message?.includes('Cast to')) {
    statusCode = 400;
    message = 'Formato de ID inválido';
    errorCode = 'INVALID_ID';
  }

  // Log error with context
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    user: req.user?.id || 'anonymous',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Only send stack trace in development
  const response: Record<string, unknown> = {
    success: false,
    error: {
      message,
      code: errorCode,
      ...(details && process.env.NODE_ENV === 'development' && { details }),
    },
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      path: req.path,
      method: req.method,
    }),
  };

  res.status(statusCode).json(response);
}

/**
 * 404 Handler - Catches all unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;

