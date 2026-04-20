# 🚀 EMSC ACADEMY v2.0 — DEPLOYMENT & UPDATE GUIDE

## ✅ CAMBIOS REALIZADOS

### Frontend Improvements
- ✅ Migrado a **TypeScript** (type-safe)
- ✅ **Design System** profesional con Tailwind extendido
- ✅ **Componentes UI reutilizables**: Button, Card, Input, Badge, Modal, Alert, Avatar, Progress, Skeleton
- ✅ **Services layer** con API centralizada (axios interceptors)
- ✅ **AuthService** mejorado con Supabase
- ✅ **CourseService** con cache y filtros
- ✅ **Navbar** optimizado con dropdown de usuario y roles múltiples
- ✅ **Login** rediseñado con validación y social auth
- ✅ **CourseCard** enterprise-grade con ratings, badges, progress
- ✅ **App.tsx** con scroll-to-top y mejor routing
- ✅ **CSS Variables** para design tokens
- ✅ **Formatters utils** (precio, fecha, duración)

### Backend Improvements
- ✅ Migrado a **TypeScript** con strict mode
- ✅ Arquitectura en capas: `routes → controllers → services`
- ✅ **Middleware robusto**: Auth (JWT + cache), Rate limiting, Error handling
- ✅ **Zod schemas** para validación de requests
- ✅ **RBAC** completo con permissions granulares
- ✅ **CourseService** con filtros avanzados, paginación, search
- ✅ **Error handling** estandarizado con clases custom
- ✅ **Type definitions** completas para todo el sistema
- ✅ **API responses** estandarizadas
- ✅ **Security headers** con Helmet
- ✅ **Graceful shutdown** handling

### DevOps
- ✅ **GitHub Actions** workflows (CI/CD para frontend y backend)
- ✅ **Docker** configuration (Dockerfile + docker-compose.yml)
- ✅ **Railway.toml** + **Procfile** para Railway
- ✅ **vercel.json** para Vercel optimizations
- ✅ **ESLint + Prettier** configurados
- ✅ **.env.example** completos para ambos lados
- ✅ **Scripts** de deployment automatizados

---

## 📦 INSTALACIÓN DE DEPENDENCIAS

### Backend
```bash
cd backend
npm install
```

**Nuevas dependencias críticas:**
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `helmet` - Security headers
- `compression` - Response compression
- `zod` - Schema validation
- `winston` - Logging (opcional)
- `ioredis` - Redis client (opcional)
- `express-async-errors` - Async error handling

### Frontend
```bash
cd frontend
npm install
```

**Nuevas dependencias críticas:**
- `class-variance-authority` - Component variants (CVA)
- `react-hot-toast` - Notifications
- `@headlessui/react` - Headless UI components
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation with Zod
- `zod` - Schema validation
- `@tailwindcss/forms` - Form styling plugin
- `@tailwindcss/typography` - Typography plugin
- `tailwindcss-animate` - Animation utilities

---

## 🔧 CONFIGURACIÓN

### 1. Variables de Entorno

#### Backend `.env`
```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# JWT (CRITICAL - change this!)
JWT_SECRET=your-super-secret-jwt-key-at-least-256-bits-long-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://emsc-academy.vercel.app,https://academy.emsc.es,http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (choose one)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...

# Redis (optional - for caching)
REDIS_URL=redis://localhost:6379

# Monitoring (optional)
SENTRY_DSN=https://...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend `.env.local`
```env
REACT_APP_API_URL=https://emsc-backend.up.railway.app/api
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🚢 ACTUALIZAR EN GITHUB

```bash
# Desde la raíz del proyecto
cd C:\Users\Eagle GlobalCommerce\Downloads\emsc-academy-main\emsc-academy-main

# Añadir todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: enterprise-grade refactor v2.0

BREAKING CHANGES:
- Migrated to TypeScript (frontend + backend)
- New design system with brand colors
- Layered backend architecture (routes→controllers→services)
- Professional UI components library
- RBAC with permissions
- Advanced course filtering
- Optimized API with caching
- Rate limiting & security hardening
- CI/CD workflows for GitHub Actions
- Docker & Railway configuration

Frontend:
- Button, Card, Input, Badge, Modal, Alert components
- CourseCard with ratings & progress
- AuthService & CourseService
- API service with interceptors
- Utils: formatters, validators

Backend:
- JWT auth with caching
- Zod validation schemas
- Error handling with custom classes
- CourseService with advanced filters
- Rate limiter (memory + Redis support)
- Helmet security headers
- Graceful shutdown

DevOps:
- GitHub Actions CI/CD
- Docker + docker-compose
- Railway.toml + Procfile
- vercel.json optimizations
- ESLint + Prettier configs"

# Push a GitHub
git push origin main
```

**⚠️ IMPORTANTE:** Este push activará:
- GitHub Actions workflows (CI)
- Vercel auto-deploy (si conectado)
- Railway auto-deploy (si conectado)

---

## 🌐 VERCEL — FRONTEND DEPLOYMENT

### Auto-Deploy (Recomendado)

Vercel detectará tu push a `main` y rebuildeará automáticamente si ya está conectado.

**Verificar build settings en Vercel dashboard:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Environment Variables en Vercel

Ve a: **Project Settings → Environment Variables**

Añade:
```
REACT_APP_API_URL → https://tu-backend.up.railway.app/api
REACT_APP_SUPABASE_URL → https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY → eyJ...
REACT_APP_STRIPE_PUBLISHABLE_KEY → pk_live_...
```

**Scope:** Production, Preview, Development (todos)

### Manual Deploy

```bash
cd frontend
vercel --prod
```

---

## 🚂 RAILWAY — BACKEND DEPLOYMENT

### Auto-Deploy

Railway detectará push a `main` en la carpeta `backend/` y rebuildeará.

**Verificar Railway settings:**
- Root Directory: `backend`
- Build Command: `npm run build`
- Start Command: `npm start`
- Watch Paths: `backend/**`

### Environment Variables en Railway

Ve a: **Project → Variables**

Añade TODAS las variables de `backend/.env.example`:
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
JWT_SECRET=... (CRITICAL!)
CORS_ORIGIN=https://emsc-academy.vercel.app
(... resto de variables)
```

### Manual Deploy

```bash
cd backend
railway up
```

### Verificar Health Check

```bash
curl https://tu-backend.up.railway.app/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2026-04-20T10:00:00.000Z",
    "uptime": 123,
    "environment": "production",
    "version": "2.0.0",
    "services": {
      "database": "up",
      "cache": "not_configured"
    }
  }
}
```

---

## 🗄️ SUPABASE — DATABASE

### Schema ya está creado
Tu schema actual en Supabase es válido. Los cambios son **backward compatible**.

### Opcional: Ejecutar migraciones SQL adicionales

Si quieres las mejoras de schema que propuse (campos extendidos), ejecuta en **SQL Editor**:

```sql
-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS es_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS idioma TEXT DEFAULT 'es',
ADD COLUMN IF NOT EXISTS zona_horaria TEXT DEFAULT 'Europe/Madrid';

-- Add instructor fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS titulo_profesional TEXT,
ADD COLUMN IF NOT EXISTS experiencia_anios INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS especialidades TEXT[],
ADD COLUMN IF NOT EXISTS calificacion_promedio NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Update courses table
ALTER TABLE cursos
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS etiquetas TEXT[],
ADD COLUMN IF NOT EXISTS objetivos_aprendizaje TEXT[],
ADD COLUMN IF NOT EXISTS requisitos TEXT[],
ADD COLUMN IF NOT EXISTS imagen_principal_url TEXT,
ADD COLUMN IF NOT EXISTS video_trailer_url TEXT,
ADD COLUMN IF NOT EXISTS total_inscripciones INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_completados INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS calificacion_promedio NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reseñas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS moneda TEXT DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS precio_descuento NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS fecha_oferta_fin TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS numero_lecciones INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiene_certificado BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS politica_devolucion_dias INTEGER DEFAULT 14;

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_cursos_slug ON cursos(slug);

-- Update inscripciones table
ALTER TABLE inscripciones_estudiantes
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'completada', 'expirada')),
ADD COLUMN IF NOT EXISTS leccion_actual_id UUID REFERENCES lecciones(id),
ADD COLUMN IF NOT EXISTS modulo_actual_id UUID REFERENCES modulos(id),
ADD COLUMN IF NOT EXISTS calificacion_final NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS certificado_url TEXT,
ADD COLUMN IF NOT EXISTS fecha_certificado TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS moneda TEXT DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS fecha_ultimo_acceso TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS total_tiempo_visto_segundos INTEGER DEFAULT 0;
```

**⚠️ NOTA:** Estos comandos son seguros (usan `IF NOT EXISTS`). Si las columnas ya existen, se ignoran.

---

## 📱 TESTING LOCAL

### Backend
```bash
cd backend

# Instalar dependencias nuevas
npm install

# Type-check
npm run type-check

# Build
npm run build

# Start
npm run dev
```

**Expected output:**
```
🚀 ═══════════════════════════════════════════════
   EMSC Academy API Server
   ═══════════════════════════════════════════════
   🌍 Environment: development
   🔌 Port: 5000
   📡 URL: http://localhost:5000
   📚 API Docs: http://localhost:5000/api
   ✅ Health: http://localhost:5000/api/health
   ═══════════════════════════════════════════════
```

Test endpoint:
```bash
curl http://localhost:5000/api/health
```

### Frontend
```bash
cd frontend

# Instalar dependencias nuevas
npm install

# Type-check
npm run type-check

# Lint
npm run lint

# Start dev server
npm run dev
```

Abre: `http://localhost:3000`

---

## 🔒 SECURITY CHECKLIST

Antes de production:

- [ ] Cambiar `JWT_SECRET` a un valor aleatorio seguro (min 32 caracteres)
- [ ] Configurar CORS_ORIGIN solo con dominios production
- [ ] Habilitar Rate Limiting en Railway (Redis recomendado)
- [ ] Configurar Stripe Webhooks en dashboard
- [ ] Habilitar RLS (Row Level Security) en Supabase para tablas críticas
- [ ] Añadir dominio personalizado con SSL
- [ ] Configurar Sentry para monitoring (opcional)
- [ ] Revisar logs de Railway/Vercel para errores

---

## 📊 MONITORING

### Logs

**Railway:**
```bash
railway logs --follow
```

O desde dashboard: Project → Deployments → View Logs

**Vercel:**
```bash
vercel logs https://emsc-academy.vercel.app
```

O desde dashboard: Deployments → Functions → View Functions

### Performance Metrics

- **Vercel Analytics**: Automático (habilitado en dashboard)
- **Lighthouse**: Ejecutar en Chrome DevTools
  - Target: > 90 en todas categorías

---

## 🆘 TROUBLESHOOTING

### Error: "Module not found"

**Solución:**
```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd frontend
npm install
```

### Error: "Cannot find module '@/types'"

**Causa:** Path aliases no configurados.

**Solución:** Verifica que `tsconfig.json` tenga:
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

Y reinicia VS Code/IDE.

### Error: "CORS blocked"

**Solución:** Verifica que `CORS_ORIGIN` en Railway incluya tu dominio de Vercel:
```env
CORS_ORIGIN=https://emsc-academy.vercel.app,http://localhost:3000
```

### Error: "Supabase auth failed"

**Verificar:**
1. `SUPABASE_URL` y `SUPABASE_ANON_KEY` correctas
2. Tabla `users` existe y tiene relación con `auth.users`
3. Enable Email Auth en Supabase → Authentication → Providers

### Build fails con TypeScript errors

**Solución:**
```bash
# Check errors
npm run type-check

# Common fix: missing types
npm install -D @types/react @types/react-dom @types/react-router-dom
```

---

## 🚀 COMANDOS RÁPIDOS

```bash
# === INSTALACIÓN INICIAL ===
cd backend && npm install && cd ../frontend && npm install && cd ..

# === BUILD COMPLETO ===
cd backend && npm run build && cd ../frontend && npm run build && cd ..

# === DEV MODE ===
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev

# === LINT & TYPE-CHECK ===
cd backend && npm run lint && npm run type-check && cd ..
cd frontend && npm run lint && npm run type-check && cd ..

# === GIT ===
git add .
git commit -m "feat: descripción"
git push origin main

# === DEPLOY ===
# Frontend (manual)
cd frontend && vercel --prod

# Backend (manual)
cd backend && railway up
```

---

## 📈 PRÓXIMOS PASOS

### Implementar características faltantes (opcionales):

1. **Register page** con nuevos componentes UI
2. **Catalogo page** con filtros avanzados y CourseCard
3. **CursoDetalle** con temario expandible y CTA sticky
4. **MisCursos** con tabs y progreso visual
5. **Video Player** personalizado con notas
6. **Quiz Engine** completo
7. **Certificates** generator con PDF
8. **Email notifications** con templates
9. **Search** full-text con Algolia/MeiliSearch
10. **Analytics dashboard** con charts

### Base de datos (si necesario):

11. **Crear tablas adicionales**: `reseñas`, `notificaciones`, `eventos_analytics`
12. **RLS Policies** en Supabase para seguridad
13. **Database indexes** para queries frecuentes

---

## ✅ VERIFICACIÓN FINAL

Antes de marcar como "done", verifica:

- [ ] Backend compila sin errores: `cd backend && npm run type-check`
- [ ] Frontend compila sin errores: `cd frontend && npm run type-check`
- [ ] Backend inicia localmente: `npm run dev` (puerto 5000)
- [ ] Frontend inicia localmente: `npm run dev` (puerto 3000)
- [ ] Login funciona (con Supabase)
- [ ] Catálogo muestra cursos
- [ ] Navbar muestra dropdown de usuario
- [ ] Dark mode funciona
- [ ] Commit y push a GitHub exitoso
- [ ] Railway build exitoso (check logs)
- [ ] Vercel build exitoso (check dashboard)
- [ ] API health check responde: `curl https://tu-backend.up.railway.app/api/health`

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Check logs primero**: Railway logs + Vercel logs
2. **Verificar environment variables**: Todas configuradas en Railway/Vercel
3. **Limpiar cache**: `rm -rf node_modules && npm install`
4. **Rebuild**: `npm run build`

---

**🎉 Tu plataforma ahora es Enterprise-grade con:**
- TypeScript end-to-end
- Design system profesional
- Arquitectura escalable
- Security hardening
- CI/CD automatizado
- Production-ready

---

*Actualizado: 20 de abril de 2026*
*Versión: 2.0.0*
