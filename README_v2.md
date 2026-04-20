# 🎓 EMSC Academy v2.0 — Enterprise LMS Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)

Plataforma profesional de formación técnica especializada en **agua, energía y automatización industrial**.

---

## 🚀 ACTUALIZAR Y DESPLEGAR

### 1. Instalar nuevas dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Push a GitHub

```bash
# Desde raíz
git add .
git commit -m "feat: v2.0 enterprise refactor - TypeScript + Design System"
git push origin main
```

### 3. Auto-Deploy

- **Vercel** rebuildeará automáticamente el frontend
- **Railway** rebuildeará automáticamente el backend

**Verifica:**
- Frontend: https://emsc-academy.vercel.app
- Backend: https://tu-backend.up.railway.app/api/health

---

## ✨ CAMBIOS PRINCIPALES v2.0

### Frontend
✅ **TypeScript** completo  
✅ **Design System** profesional (brand colors, components)  
✅ **UI Components**: Button, Card, Input, Badge, Modal, Alert, Avatar, Progress  
✅ **CourseCard** enterprise-grade  
✅ **Login/Register** rediseñados  
✅ **Services layer** (API centralizada)  
✅ **Dark mode** mejorado  

### Backend
✅ **TypeScript** con arquitectura en capas  
✅ **JWT Auth** con cache  
✅ **RBAC** con permissions  
✅ **Rate Limiting**  
✅ **Zod Validation**  
✅ **Error Handling** profesional  
✅ **CourseService** con filtros avanzados  

### DevOps
✅ **GitHub Actions** CI/CD  
✅ **Docker** configuration  
✅ **ESLint + Prettier**  

---

## 📖 Documentación

Ver **[DEPLOYMENT.md](./DEPLOYMENT.md)** para:
- Instalación completa
- Configuración de environment variables
- Deployment a Vercel, Railway, Supabase
- Troubleshooting
- Security checklist

---

## 📞 Contacto

**Admin:** Enrique Arias - [enrique.arias@emsc.es](mailto:enrique.arias@emsc.es)  
**Web:** [emsc.es](https://emsc.es)  

---

© 2024-2026 EMSC Global Water Solutions, S.L.
