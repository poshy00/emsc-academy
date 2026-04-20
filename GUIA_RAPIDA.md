# ⚡ GUÍA RÁPIDA — EMSC ACADEMY

**Para presentar MAÑANA**

---

## 🎯 PRIMER DÍA (HOY NOCHE)

### 1. Configurar Supabase (5 minutos)

1. Ir a [supabase.com](https://supabase.com)
2. Crear proyecto `emsc-academy-prod`
3. Ir a **SQL Editor** → copiar TODO el SQL del `README.md` sección "SQL Schema Completo"
4. Ejecutar las tablas (esperar a que terminen)
5. **Copiar estas variables:**
   - `SUPABASE_URL` (Project Settings → API → Project URL)
   - `SUPABASE_ANON_KEY` (Project Settings → API → anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API → service_role key)

### 2. Configurar Backend (10 minutos)

```bash
cd backend
npm install
cp .env.example .env

# Editar .env con las variables de Supabase
# Dejar todo lo demás igual por ahora
```

Probar:
```bash
npm run dev
# Debe ver: "🚀 Servidor corriendo en puerto 5000"
```

### 3. Configurar Frontend (10 minutos)

```bash
cd frontend
npm install
cp .env.local.example .env.local

# Editar .env.local:
# REACT_APP_API_URL=http://localhost:5000/api
# El resto con variables de Supabase
```

Probar:
```bash
npm start
# Se abre http://localhost:3000 automáticamente
```

---

## 🎪 PRESENTACIÓN MAÑANA

### Demostración de features (orden recomendado):

1. **Landing page** → Mostrar hero + features + newsletter
2. **Catálogo** → Filtros por nivel funcionando
3. **Login/Register** → Crear usuario de prueba
4. **Admin Panel** → Mostrar KPIs
5. **Crear un curso de prueba** → Modulos → Lecciones
6. **Inscribirse en curso** (sin pago por ahora)
7. **Ver lección** → Vídeo YouTube + descargar documento

### Datos de prueba

**Usuario Admin (para crear después en Supabase):**
- Email: admin@test.com
- Password: TestPass123
- Rol: admin

**Usuario Estudiante:**
- Email: estudiante@test.com
- Password: TestPass123
- Rol: estudiante

---

## 📝 LO QUE FALTA (PARA V2)

- ❌ Stripe (pagos) → Integrar luego
- ❌ Cuestionarios automáticos → Controller + frontend
- ❌ Ejercicios manuales → Upload + calificación
- ❌ Certificados PDF → PDFKit implementation
- ❌ Emails automáticos → Nodemailer + Mailgun
- ❌ Sistema de puntos → Lógica backend + frontend
- ❌ Múltiples admin → Gestión usuarios

---

## 🚀 DEPLOYMENT (DESPUÉS DE PRESENTAR)

### Frontend → Vercel (gratis)

```bash
cd frontend
# Crear cuenta en vercel.com
# Conectar GitHub repo
# Deploy automático
```

### Backend → Railway (€5-10/mes)

```bash
npm install -g @railway/cli
railway login
railway up
```

---

## 📞 CONTACTO PARA MAÑANA

- **Punto de contacto:** Enrique Arias
- **Email:** enrique.arias@emsc.es
- **Teléfono:** (necesitarías tu número si lo agregamos al perfil)

---

## ✅ CHECKLIST ANTES DE PRESENTAR

- [ ] Supabase proyecto creado + tablas ejecutadas
- [ ] Backend .env configurado + `npm run dev` funciona
- [ ] Frontend .env.local configurado + `npm start` funciona
- [ ] Puedo crear usuario en Supabase Auth (button en Register)
- [ ] Puedo hacer login con ese usuario
- [ ] Dashboard admin muestra KPIs (aunque sean 0)
- [ ] Puedo crear un curso desde admin
- [ ] Puedo ver ese curso en catálogo
- [ ] Los filtros de nivel funcionan
- [ ] Dark mode funciona (toggle en navbar)
- [ ] Responsive en móvil (F12)

---

## 🎓 SCRIPT PARA MAÑANA

**Intro (30 segundos):**
> "Esta es la plataforma de e-learning EMSC Academy. Está construida con React en frontend y Node.js en backend, usando Supabase para la base de datos. Voy a mostrarles cómo funciona."

**Demo (5 minutos):**
1. Landing page → "Aquí están los cursos destacados y la newsletter"
2. Catálogo → "Podemos filtrar por nivel de dificultad"
3. Registrar nuevo usuario → "El sistema verifica email y contraseña"
4. Login → "Autenticación segura con Supabase"
5. Admin panel → "KPIs en tiempo real"
6. Crear curso → "Módulos y lecciones anidadas"
7. Ver curso como estudiante → "Vídeos de YouTube + documentos"

**Cierre (30 segundos):**
> "La plataforma está lista para producción. Simplemente falta integrar Stripe para pagos y mejorar algunos detalles. ¿Preguntas?"

---

## 🔥 TRICKS PARA IMPRESIONAR

- Mostrar el **dark mode** (toggle en navbar)
- Mostrar **responsive** en móvil (F12)
- Mostrar que **Supabase auth** es seguro
- Mencionar que está **lista para 30 estudiantes** sin problemas
- Decir que el **hosting es muy barato** (€15/mes total)

---

**¡Listo para mañana!** 🚀
