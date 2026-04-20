# 🎓 EMSC Academy — Plataforma E-Learning

Plataforma de formación técnica especializada en agua, energía y automatización industrial.

**Stack:** React.js + Node.js/Express + Supabase + Stripe  
**Deploy:** Vercel (frontend) + Railway (backend)

---

## 🚀 INSTALACIÓN RÁPIDA

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/yourusername/emsc-plataforma.git
cd emsc-plataforma
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus variables
npm run dev
```

**Backend corriendo en:** `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Editar .env.local con tus variables
npm start
```

**Frontend corriendo en:** `http://localhost:3000`

---

## 🗄️ Base de Datos (Supabase)

### Crear proyecto Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. En el editor SQL, ejecutar TODO el contenido de `SQL_SCHEMA.sql` (ver abajo)

### SQL Schema Completo

```sql
-- Copiar y ejecutar en Supabase SQL Editor

-- =====================================================
-- USUARIOS
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('admin', 'estudiante')),
  telefono TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTENIDO
-- =====================================================

CREATE TABLE categorias_cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  icono TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  descripcion_corta TEXT,
  imagen_url TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  moneda TEXT DEFAULT 'EUR',
  nivel TEXT CHECK (nivel IN ('basico', 'intermedio', 'avanzado')),
  duracion_horas INTEGER DEFAULT 0,
  categoria_id UUID REFERENCES categorias_cursos(id) ON DELETE SET NULL,
  publicado BOOLEAN DEFAULT FALSE,
  destacado BOOLEAN DEFAULT FALSE,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lecciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  duracion_minutos INTEGER DEFAULT 0,
  es_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leccion_id UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('youtube', 'supabase_storage', 'vimeo')),
  url TEXT NOT NULL,
  duracion_segundos INTEGER DEFAULT 0,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leccion_id UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cuestionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leccion_id UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nota_minima_aprobado NUMERIC(5,2) DEFAULT 60.00,
  intentos_permitidos INTEGER DEFAULT 3,
  es_obligatorio BOOLEAN DEFAULT FALSE,
  mostrar_respuestas_aprobado BOOLEAN DEFAULT TRUE,
  mostrar_respuestas_suspendido BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE preguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cuestionario_id UUID NOT NULL REFERENCES cuestionarios(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('multiple_choice', 'verdadero_falso', 'respuesta_corta')),
  puntos NUMERIC(5,2) DEFAULT 1.00,
  orden INTEGER DEFAULT 0,
  palabras_clave_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opciones_respuesta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  es_correcta BOOLEAN DEFAULT FALSE,
  orden INTEGER DEFAULT 0
);

CREATE TABLE ejercicios_manuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leccion_id UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  instrucciones TEXT,
  tipos_archivo_permitidos TEXT DEFAULT 'pdf,docx,zip',
  max_file_size_mb INTEGER DEFAULT 20,
  es_obligatorio BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inscripciones_estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
  fecha_completado TIMESTAMPTZ,
  porcentaje_progreso NUMERIC(5,2) DEFAULT 0,
  stripe_payment_intent_id TEXT,
  monto_pagado NUMERIC(10,2) DEFAULT 0,
  UNIQUE(estudiante_id, curso_id)
);

CREATE TABLE progreso_lecciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leccion_id UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  completada BOOLEAN DEFAULT FALSE,
  fecha_completado TIMESTAMPTZ,
  tiempo_visto_segundos INTEGER DEFAULT 0,
  UNIQUE(estudiante_id, leccion_id)
);

CREATE TABLE respuestas_cuestionario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cuestionario_id UUID NOT NULL REFERENCES cuestionarios(id) ON DELETE CASCADE,
  respuestas_json JSONB NOT NULL,
  nota_obtenida NUMERIC(5,2),
  aprobado BOOLEAN DEFAULT FALSE,
  intento_numero INTEGER DEFAULT 1,
  fecha_respuesta TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE entregas_ejercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ejercicio_id UUID NOT NULL REFERENCES ejercicios_manuales(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  comentario_estudiante TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'calificado', 'devuelto')),
  nota NUMERIC(5,2),
  comentario_admin TEXT,
  fecha_entrega TIMESTAMPTZ DEFAULT NOW(),
  fecha_calificacion TIMESTAMPTZ
);

CREATE TABLE certificados_emitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  numero_certificado TEXT UNIQUE NOT NULL,
  nota_final NUMERIC(5,2),
  fecha_emision TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT NOT NULL,
  emitido_por UUID REFERENCES users(id),
  UNIQUE(estudiante_id, curso_id)
);

CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT,
  monto_total NUMERIC(10,2) NOT NULL,
  monto_dinero NUMERIC(10,2) NOT NULL,
  moneda TEXT DEFAULT 'EUR',
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mensajes_soporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo_usuario TEXT CHECK (tipo_usuario IN ('estudiante', 'admin')),
  estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'respondido', 'cerrado')),
  respuesta_admin TEXT,
  respondido_por UUID REFERENCES users(id),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_respuesta TIMESTAMPTZ
);

CREATE TABLE anuncios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  tipo TEXT DEFAULT 'info' CHECK (tipo IN ('info', 'aviso', 'importante', 'mantenimiento')),
  visible BOOLEAN DEFAULT TRUE,
  fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
  fecha_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE historial_actividad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo_actividad TEXT NOT NULL,
  descripcion TEXT,
  leccion_id UUID REFERENCES lecciones(id),
  curso_id UUID REFERENCES cursos(id),
  fecha_actividad TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_categorias_slug ON categorias_cursos(slug);
CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_cursos_publicado ON cursos(publicado);
CREATE INDEX idx_modulos_curso ON modulos(curso_id);
CREATE INDEX idx_lecciones_modulo ON lecciones(modulo_id);
CREATE INDEX idx_inscripciones_estudiante ON inscripciones_estudiantes(estudiante_id);
CREATE INDEX idx_inscripciones_curso ON inscripciones_estudiantes(curso_id);
CREATE INDEX idx_progreso_estudiante ON progreso_lecciones(estudiante_id);
CREATE INDEX idx_entregas_estado ON entregas_ejercicios(estado);
CREATE INDEX idx_pagos_estado ON pagos(estado);
```

---

## 📋 Variables de Entorno

### Backend (`.env`)

```
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@academy.emsc.es
SMTP_PASS=your_password
EMAIL_FROM=poshyrep2@gmail.com
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=enrique.arias@emsc.es
```

### Frontend (`.env.local`)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

---

## 🚀 DEPLOYMENT

### Deploy Frontend en Vercel

```bash
cd frontend
npm install
vercel
```

**Conecta el repositorio a Vercel en el dashboard.**

### Deploy Backend en Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login a Railway
railway login

# Deploy
railway up
```

---

## 📞 Contacto

**Admin:** Enrique Arias (enrique.arias@emsc.es)  
**Web:** https://emsc.es  
**Email contacto:** poshyrep2@gmail.com

---

## 📄 Licencia

© 2024 EMSC Global Water Solutions, S.L. — Todos los derechos reservados.

---

## ✅ Checklist Inicial

- [ ] Base de datos Supabase creada y tablas ejecutadas
- [ ] Variables .env configuradas (backend)
- [ ] Variables .env.local configuradas (frontend)
- [ ] Backend `npm install` + `npm run dev`
- [ ] Frontend `npm install` + `npm start`
- [ ] Crear usuario admin en Supabase Auth
- [ ] Probar login/register
- [ ] Crear primer curso en admin panel
- [ ] Deploy en Vercel + Railway

---

**¡Listo para empezar!** 🚀
