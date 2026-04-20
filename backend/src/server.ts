import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { authRoutes, courseRoutes, lessonRoutes, paymentRoutes, webhookRouter, adminRoutes } from './routes';
import { HealthCheckResponse } from './types';

// Load environment variables first
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('⚠️  Please check your .env file');
  process.exit(1);
}

// Initialize Express app
const app: Application = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// MIDDLEWARE SETUP (order matters!)
// ============================================

// Security headers - must be first
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.SUPABASE_URL || ''],
    },
  },
  crossOriginEmbedderPolicy: false, // For embedding YouTube videos
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Add default localhost for development
if (NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowed => 
      origin === allowed || origin.endsWith(allowed.replace('https://', ''))
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balance between speed and compression
}));

// Request logging (skip health checks)
if (NODE_ENV === 'development') {
  app.use(morgan('dev', {
    skip: (req) => req.url === '/api/health',
  }));
} else {
  // Production: structured logging
  app.use(morgan('combined', {
    skip: (req) => req.url === '/api/health',
  }));
}

// Rate limiting (global)
app.use('/api', generalLimiter);

// Trust proxy (required for Railway, Heroku, etc.)
app.set('trust proxy', 1);

// ============================================
// API ROUTES
// ============================================

// Health check endpoint (no auth, no rate limit)
app.get('/health', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const response: HealthCheckResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    services: {
      database: 'up', // TODO: actual DB health check
    },
  };
  res.status(200).json(response);
});

app.get('/api/health', (req: Request, res: Response) => {
  const uptime = process.uptime();
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      environment: NODE_ENV,
      version: '2.0.0',
      services: {
        database: 'up',
        cache: process.env.REDIS_URL ? 'up' : 'not_configured',
      },
    },
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'EMSC Academy API',
      version: '2.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      documentation: '/api/docs',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth/*',
        courses: '/api/cursos/*',
        lessons: '/api/lecciones/*',
        payments: '/api/pagos/*',
        admin: '/api/admin/*',
      },
    },
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/cursos', courseRoutes);
app.use('/api/lecciones', lessonRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Webhook route (Stripe - must be before bodyParser in webhook router itself)
app.use('/webhook', webhookRouter);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Central error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed');
    
    // Close database connections, Redis, etc.
    // TODO: Add cleanup logic here
    
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log(`   EMSC Academy API Server`);
  console.log('   ═══════════════════════════════════════════════');
  console.log(`   🌍 Environment: ${NODE_ENV}`);
  console.log(`   🔌 Port: ${PORT}`);
  console.log(`   📡 URL: http://localhost:${PORT}`);
  console.log(`   📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`   ✅ Health: http://localhost:${PORT}/api/health`);
  console.log('   ═══════════════════════════════════════════════');
  console.log('');
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;

