# 🚀 EMSC ACADEMY — COMANDOS PARA ACTUALIZAR EN GITHUB

## PASOS RÁPIDOS (Copiar y pegar)

```bash
# 1. Navegar al directorio
cd "C:\Users\Eagle GlobalCommerce\Downloads\emsc-academy-main\emsc-academy-main"

# 2. Verificar estado
git status

# 3. Añadir TODOS los archivos (nuevos + modificados)
git add .

# 4. Commit con mensaje descriptivo
git commit -m "feat: enterprise-grade refactor v2.0

BREAKING CHANGES:
- Migrated entire codebase to TypeScript
- Implemented professional design system
- New UI component library (Button, Card, Input, etc.)
- Backend layered architecture (routes→controllers→services)
- JWT auth with RBAC and permissions
- Advanced course filtering and pagination
- Rate limiting and security hardening
- Zod validation schemas
- Error handling with custom classes
- CI/CD workflows (GitHub Actions)
- Docker and Railway configuration
- API service layer with interceptors

Frontend (React + TypeScript):
✅ Button, Card, Input, Badge, Modal, Alert, Avatar, Progress, Skeleton
✅ CourseCard enterprise-grade
✅ Login/Register redesigned
✅ Services: API, Auth, Course, Progress
✅ Utils: formatters, validators
✅ Navbar with user dropdown
✅ App.tsx optimized
✅ Tailwind config extended
✅ CSS variables for design tokens

Backend (Node.js + TypeScript):
✅ Middleware: auth (JWT + cache), rateLimiter, errorHandler
✅ CourseService with filters, search, pagination
✅ Zod validation schemas
✅ Type definitions complete
✅ API responses standardized
✅ Security: Helmet, CORS, rate limiting
✅ Graceful shutdown

DevOps:
✅ GitHub Actions workflows
✅ Docker + docker-compose
✅ Railway.toml + Procfile
✅ vercel.json
✅ ESLint + Prettier
✅ .env.example complete"

# 5. Push a GitHub
git push origin main
```

---

## ✅ VERIFICACIÓN POST-PUSH

Espera 2-3 minutos y verifica:

### GitHub
✅ Commits aparecen en: https://github.com/poshy00/emsc-academy/commits/main
✅ Actions running en: https://github.com/poshy00/emsc-academy/actions

### Vercel (Frontend)
✅ Dashboard: https://vercel.com/dashboard
✅ Build automático iniciado
✅ URL: https://emsc-academy.vercel.app

### Railway (Backend)
✅ Dashboard: https://railway.app/dashboard
✅ Build automático iniciado
✅ Health check: `https://tu-backend.up.railway.app/api/health`

---

## ⚠️ SI HAY ERRORES DE BUILD

### Frontend (Vercel)

**Error común:** "Cannot find module '@/types'"

**Solución:**
1. Verifica que `tsconfig.json` existe en frontend
2. Verifica que tiene `"baseUrl": "src"` y paths configurados
3. En Vercel dashboard → Settings → Environment Variables → añade:
   ```
   REACT_APP_API_URL
   REACT_APP_SUPABASE_URL
   REACT_APP_SUPABASE_ANON_KEY
   ```
4. Redeploy manually: Deployments → ... → Redeploy

### Backend (Railway)

**Error común:** "Missing environment variables"

**Solución:**
1. Railway dashboard → tu proyecto → Variables
2. Añade TODAS las variables de `backend/.env.example`
3. **CRÍTICO:** `JWT_SECRET` (min 32 caracteres random)
4. `CORS_ORIGIN` debe incluir tu dominio Vercel
5. Redeploy: Deployments → ... → Redeploy

---

## 🧪 TESTING LOCAL ANTES DE PUSH

Si quieres probar localmente antes de pushear:

```bash
# Backend
cd backend
npm install
npm run type-check    # Verifica TypeScript
npm run lint          # Verifica código
npm run build         # Compila
npm run dev           # Inicia servidor

# Frontend (otra terminal)
cd frontend
npm install
npm run type-check
npm run lint
npm run build
npm run dev
```

Abre navegador: `http://localhost:3000`

---

## 📊 RESUMEN DE ARCHIVOS MODIFICADOS

### Nuevos archivos creados (86 archivos):

**Frontend:**
- `src/components/ui/` - 9 componentes
- `src/components/course/CourseCard.tsx`
- `src/services/` - 4 services
- `src/utils/formatters.ts`
- `src/types/index.ts` - Actualizado
- `tsconfig.json`

**Backend:**
- `src/` - Toda la estructura modular
- `src/middleware/` - 3 middlewares mejorados
- `src/services/CourseService.ts`
- `src/utils/validators.ts`
- `src/types/index.ts`
- `tsconfig.json`

**DevOps:**
- `.github/workflows/` - 4 workflows
- `backend/Dockerfile`
- `backend/docker-compose.yml`
- `backend/railway.toml`
- `backend/Procfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/vercel.json`
- `.eslintrc.js`
- `.prettierrc`

**Documentación:**
- `DEPLOYMENT.md`
- `README_v2.md`
- Este archivo: `UPDATE_INSTRUCTIONS.md`

### Archivos modificados:

**Frontend:**
- `tailwind.config.js` - Design system
- `src/index.css` - CSS variables
- `src/App.tsx` - TypeScript + mejoras
- `src/components/layout/Navbar.tsx` - Mejorado
- `src/pages/public/Login.tsx` - Redesigned
- `package.json` - Dependencies actualizadas

**Backend:**
- `src/server.ts` - Refactorizado
- `src/middleware/auth.ts` - JWT + cache
- `src/middleware/errorHandler.ts` - Clases custom
- `package.json` - Dependencies actualizadas

---

## 🎯 SIGUIENTE PASO

**Ejecuta:**

```bash
git add .
git commit -m "feat: v2.0 enterprise refactor"
git push origin main
```

**Listo. Tu código estará en GitHub en 10 segundos y desplegado en Vercel/Railway en 2-3 minutos.**

---

*Documento generado: 20 abril 2026 12:24*
