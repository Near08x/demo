# 🚀 Plan de Acción - GitHub Launch Ready

**Objetivo:** Transformar la app en un portfolio piece profesional que impresione a reclutadores  
**Timeline:** 6-8 horas de trabajo enfocado  
**Resultado:** Repositorio GitHub-ready con documentación completa

---

## 📋 FASE 1: DOCUMENTACIÓN CORE (2-3 horas)

### ✅ Task 1.1: README.md Principal
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 45 min  

**Contenido requerido:**
- [ ] Header con logo/banner profesional
- [ ] Badges (TypeScript, Next.js, Tests, Build Status)
- [ ] Demo en vivo (URL de Vercel)
- [ ] Screenshot principal (dashboard)
- [ ] Tech stack visual con iconos
- [ ] Features principales (bullet points)
- [ ] Quick start (3 pasos máximo)
- [ ] Demo credentials destacadas
- [ ] Links a LinkedIn/GitHub/Portfolio
- [ ] License badge

**Estructura sugerida:**
```markdown
# 🏪 Studio - Business Management System

> Full-stack Next.js application for comprehensive business management

[DEMO](https://studio-demo.vercel.app) | [Features](#features) | [Tech Stack](#tech-stack)

![Dashboard Screenshot](docs/screenshots/dashboard.png)

## 🎯 About This Project
Enterprise-grade business management system built to demonstrate modern web development...

## ✨ Key Features
- 💰 Loan Management with automatic calculations
- 🛒 Point of Sale system
- 📦 Inventory tracking
- 📊 Financial analytics dashboard
- 👥 Client relationship management

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase Auth (HttpOnly cookies)
- **Testing:** Vitest (57 tests)
- **Deploy:** Vercel

## 🚀 Quick Start
[Commands y pasos simples]

## 👤 About Me
Built by [Tu Nombre] - Full Stack Developer
[LinkedIn] | [Portfolio] | [Email]
```

---

### ✅ Task 1.2: FEATURES.md Restructurado
**Prioridad:** 🟡 ALTA  
**Tiempo:** 30 min  

**Acción:**
- [ ] Eliminar contenido en español
- [ ] Reescribir en inglés profesional
- [ ] Agregar screenshots por feature
- [ ] Incluir código de ejemplo
- [ ] Link a documentación técnica

**Secciones:**
```markdown
# Features Documentation

## Loan Management System
[Screenshot]
- Complex interest calculations
- Multiple payment frequencies
- Automatic late fee computation
- Payment history tracking

**Technical Highlights:**
- Service layer pattern
- Decimal.js for precision
- Comprehensive testing

[View Code](src/modules/loans)

## Point of Sale
[Screenshot + GIF]
...
```

---

### ✅ Task 1.3: ARCHITECTURE.md (Nuevo)
**Prioridad:** 🟡 ALTA  
**Tiempo:** 45 min  

**Contenido:**
- [ ] System architecture diagram
- [ ] Database schema
- [ ] Folder structure explicada
- [ ] Design patterns utilizados
- [ ] Data flow diagrams
- [ ] Security architecture

**Incluir:**
```markdown
# Architecture Documentation

## System Overview
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
┌──────▼──────────┐
│   Next.js 15    │
│  (App Router)   │
├─────────────────┤
│ Server Actions  │
│ API Routes      │
├─────────────────┤
│ Services Layer  │
│ Repositories    │
└──────┬──────────┘
       │
┌──────▼──────┐
│  Supabase   │
│ PostgreSQL  │
└─────────────┘
```

## Design Patterns
- Repository Pattern
- Service Layer
- Factory Pattern (Loan Calculator)

## Security Implementation
- HttpOnly cookies for JWT
- CSRF protection
- Input validation (Zod)
- XSS prevention headers
```

---

### ✅ Task 1.4: API.md (Nuevo)
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 30 min  

**Contenido:**
```markdown
# API Documentation

## Authentication Endpoints

### POST /api/auth/login
**Description:** Authenticate user and set secure cookies

**Request:**
```json
{
  "email": "demo@example.com",
  "password": "DemoPassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "demo@example.com",
    "role": "admin"
  }
}
```

**Security:**
- Sets HttpOnly cookie (7 day expiration)
- CSRF token in separate cookie
- Rate limited (future)

[Continuar con todos los endpoints...]
```

---

## 📋 FASE 2: VISUAL ASSETS (1-2 horas)

### ✅ Task 2.1: Screenshots
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 45 min  

**Requeridos:**
- [ ] Dashboard principal (1920x1080)
- [ ] Loans module (con tabla)
- [ ] POS interface (durante venta)
- [ ] Finance dashboard (gráficos)
- [ ] Mobile responsive (375x667)
- [ ] Login page

**Ubicación:** `docs/screenshots/`

**Herramienta:** Chrome DevTools (Ctrl+Shift+P → Screenshot)

---

### ✅ Task 2.2: Logo y Branding
**Prioridad:** 🟡 ALTA  
**Tiempo:** 30 min  

**Crear:**
- [ ] Logo principal (SVG)
- [ ] Favicon (32x32, 16x16)
- [ ] OG Image (1200x630)
- [ ] Apple touch icon (180x180)

**Herramientas:**
- Canva (templates gratis)
- Figma (diseño custom)
- Logo.com (generador AI)

**Ubicación:**
```
public/
  ├─ logo.svg
  ├─ favicon.ico
  ├─ og-image.png
  └─ apple-touch-icon.png
```

---

### ✅ Task 2.3: Demo GIF
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 20 min  

**Capturar:**
- [ ] Login → Dashboard flow (10 seg)
- [ ] Create loan flow (15 seg)
- [ ] POS sale flow (15 seg)

**Herramienta:** ScreenToGif (Windows) o LICEcap

**Ubicación:** `docs/demo/`

---

## 📋 FASE 3: CODE QUALITY DOCS (1 hora)

### ✅ Task 3.1: TESTING.md
**Prioridad:** 🟡 ALTA  
**Tiempo:** 20 min  

```markdown
# Testing Documentation

## Test Coverage

```bash
npm test
```

**Current Status:**
- ✅ 57 tests passing
- ✅ 3 test suites
- ✅ Coverage: ~80%

## Test Structure

### Unit Tests
- Loan Calculator (`loans.calculator.test.ts`)
- Loan Service (`loans.service.test.ts`)

### Integration Tests
- API Routes (`route.test.ts`)

## Running Tests
[Commands y ejemplos]
```

---

### ✅ Task 3.2: CONTRIBUTING.md
**Prioridad:** 🟢 BAJA  
**Tiempo:** 15 min  

**Contenido:**
- [ ] Code style guide
- [ ] Branch naming
- [ ] Commit conventions
- [ ] PR template
- [ ] How to report issues

---

### ✅ Task 3.3: SECURITY.md
**Prioridad:** 🟡 ALTA  
**Tiempo:** 25 min  

```markdown
# Security Policy

## Implemented Security Measures

### Authentication
- HttpOnly cookies for JWT storage
- Secure flag on production
- SameSite=Lax for CSRF protection
- 7-day token expiration

### Input Validation
- Zod schemas on all API endpoints
- SQL injection prevention (Supabase RLS)
- XSS prevention headers

### Headers
- Content-Security-Policy (restrictive)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

## Reporting Vulnerabilities
[Contact info]
```

---

## 📋 FASE 4: DEPLOYMENT & DOCKER (2-3 horas)

### ✅ Task 4.1: Vercel Production Deploy
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 45 min  

**Pasos:**

1. **Conectar Repository a Vercel**
   - [ ] Login en [vercel.com](https://vercel.com)
   - [ ] Import Git Repository
   - [ ] Configurar proyecto: Framework Preset → Next.js

2. **Environment Variables**
   - [ ] Agregar `NEXT_PUBLIC_SUPABASE_URL`
   - [ ] Agregar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - [ ] Agregar `GOOGLE_GENAI_API_KEY` (opcional)
   - [ ] Aplicar a: Production, Preview, Development

3. **Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm ci
   ```

4. **Domain Configuration**
   - [ ] Usar dominio por defecto: `your-app.vercel.app`
   - [ ] (Opcional) Custom domain
   - [ ] Verificar HTTPS habilitado

5. **Post-Deploy Verification**
   - [ ] Check build logs
   - [ ] Test URL en vivo
   - [ ] Verificar environment variables
   - [ ] Test login flow
   - [ ] Check API endpoints

**Output:** URL production para README

---

### ✅ Task 4.2: Docker Image Creation
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 60 min  

**Objetivo:** Imagen Docker lista para Docker Hub

**1. Optimizar Dockerfile**
- [ ] Multi-stage build
- [ ] Node 18 Alpine (imagen pequeña)
- [ ] Layer caching optimizado
- [ ] Production dependencies only
- [ ] Health check endpoint

**Dockerfile mejorado:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 9000

CMD ["node", "server.js"]
```

**2. Build y Test Local**
```bash
# Build image
docker build -t studio-demo:latest .

# Test locally
docker run -p 9000:9000 \
  -e NEXT_PUBLIC_SUPABASE_URL=xxx \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx \
  studio-demo:latest

# Verify http://localhost:9000
```

**3. Docker Hub Push**
- [ ] Login: `docker login`
- [ ] Tag: `docker tag studio-demo:latest username/studio-demo:latest`
- [ ] Push: `docker push username/studio-demo:latest`
- [ ] Tag version: `docker tag studio-demo:latest username/studio-demo:v1.0.0`
- [ ] Push version: `docker push username/studio-demo:v1.0.0`

**4. Docker Compose para Producción**

Crear `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    image: username/studio-demo:latest
    ports:
      - "9000:9000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:9000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

### ✅ Task 4.3: Docker Documentation
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 30 min  

**Crear/Actualizar DOCKER.md:**

```markdown
# 🐳 Docker Deployment Guide

## Quick Start

### Pull from Docker Hub
```bash
docker pull username/studio-demo:latest
```

### Run Container
```bash
docker run -d \
  --name studio-demo \
  -p 9000:9000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  username/studio-demo:latest
```

Access: http://localhost:9000

### Using Docker Compose
```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials

# Run
docker-compose -f docker-compose.prod.yml up -d
```

## Build from Source

### Build Image
```bash
docker build -t studio-demo:latest .
```

### Run Local Build
```bash
docker-compose up -d
```

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `GOOGLE_GENAI_API_KEY`

## Troubleshooting

### Health Check
```bash
curl http://localhost:9000/api/health
```

### View Logs
```bash
docker logs -f studio-demo
```

### Restart Container
```bash
docker restart studio-demo
```
```

---

### ✅ Task 4.4: Environment Setup Files
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 20 min  

**Crear archivos:**

1. **`.env.example`**
```bash
# =================================
# Supabase Configuration (Required)
# =================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =================================
# Optional: AI Features
# =================================
GOOGLE_GENAI_API_KEY=AIzaSy...

# =================================
# Development Only
# =================================
# PORT=9000
# NODE_ENV=development
```

2. **`.dockerignore`**
```
node_modules
.next
.git
.env.local
.env*.local
npm-debug.log*
.DS_Store
*.md
docs/
.github/
```

3. **`DEPLOYMENT.md`**
   - [ ] Vercel setup completo
   - [ ] Docker deployment guide
   - [ ] Environment variables checklist
   - [ ] Troubleshooting común
   - [ ] CI/CD setup (future)

---

### ✅ Task 4.5: README Docker Section
**Prioridad:** 🟡 ALTA  
**Tiempo:** 15 min  

**Agregar al README.md:**

```markdown
## 🐳 Docker Deployment

### Pull from Docker Hub
```bash
docker pull username/studio-demo:latest
docker run -p 9000:9000 username/studio-demo:latest
```

### Build from Source
```bash
docker-compose up -d
```

See [DOCKER.md](DOCKER.md) for detailed instructions.

## 🚀 Live Demo

**Production:** https://studio-demo.vercel.app

**Docker Hub:** https://hub.docker.com/r/username/studio-demo
```

---

## 📋 FASE 5: GITHUB POLISH (1 hora)

### ✅ Task 5.1: Repository Settings
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 15 min  

**Configurar:**
- [ ] Repository description
- [ ] Topics/Tags (nextjs, typescript, supabase, etc.)
- [ ] About section con URL demo
- [ ] Social preview image (og-image.png)
- [ ] License (MIT recomendado)
- [ ] .gitignore actualizado

---

### ✅ Task 5.2: GitHub Templates
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 20 min  

**Crear `.github/` folder:**

1. **ISSUE_TEMPLATE/bug_report.md**
2. **ISSUE_TEMPLATE/feature_request.md**
3. **PULL_REQUEST_TEMPLATE.md**
4. **FUNDING.yml** (opcional - Buy Me a Coffee)

---

### ✅ Task 5.3: Badges y Shields
**Prioridad:** 🟡 ALTA  
**Tiempo:** 15 min  

**Agregar al README:**
```markdown
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tests](https://img.shields.io/badge/Tests-57%20passing-success)
![Build](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)
![License](https://img.shields.io/badge/License-MIT-green)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
```

**URL:** https://shields.io/

---

### ✅ Task 5.4: Repository Structure
**Prioridad:** 🟡 ALTA  
**Tiempo:** 10 min  

**Organizar documentación:**
```
studio-demo/
├─ docs/
│  ├─ screenshots/
│  │  ├─ dashboard.png
│  │  ├─ loans.png
│  │  ├─ pos.png
│  │  └─ finance.png
│  ├─ demo/
│  │  ├─ login-flow.gif
│  │  └─ sale-flow.gif
│  └─ architecture/
│     ├─ system-diagram.png
│     └─ database-schema.png
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
├─ README.md
├─ ARCHITECTURE.md
├─ API.md
├─ FEATURES.md
├─ TESTING.md
├─ SECURITY.md
├─ DEPLOYMENT.md
├─ CONTRIBUTING.md
├─ LICENSE
└─ CHANGELOG.md
```

---

## 📋 FASE 6: FINAL TOUCHES (30 min)

### ✅ Task 6.1: Code Cleanup
**Prioridad:** 🟡 ALTA  
**Tiempo:** 15 min  

**Verificar:**
- [ ] No hay console.logs innecesarios
- [ ] No hay TODOs sin resolver
- [ ] No hay código comentado
- [ ] Imports organizados
- [ ] Nombres de variables descriptivos

**Ejecutar:**
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

---

### ✅ Task 6.2: Performance Audit
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 15 min  

**Lighthouse Check:**
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

**Optimizaciones rápidas:**
- Lazy load images
- Optimize bundle size
- Add meta tags

---

## 📋 CHECKLIST FINAL PRE-LAUNCH

### Documentación
- [ ] README.md completo y profesional
- [ ] Screenshots en alta calidad
- [ ] Demo GIF funcionando
- [ ] ARCHITECTURE.md con diagramas
- [ ] API.md con endpoints documentados
- [ ] FEATURES.md en inglés
- [ ] SECURITY.md completo
- [ ] DOCKER.md completo
- [ ] DEPLOYMENT.md con guías Vercel y Docker
- [ ] LICENSE agregado
- [ ] .env.example actualizado
- [ ] .dockerignore configurado

### GitHub
- [ ] Repository description
- [ ] Topics agregados (nextjs, typescript, supabase, docker, vercel)
- [ ] About section con URL Vercel y Docker Hub
- [ ] Social preview image
- [ ] .gitignore completo
- [ ] Issue templates
- [ ] PR template

### Code Quality
- [ ] Lint passing
- [ ] TypeCheck passing
- [ ] Tests passing (57/57)
- [ ] Build successful
- [ ] No console.logs
- [ ] Docker build successful

### Visual
- [ ] Logo personalizado
- [ ] Favicon configurado
- [ ] OG image creado
- [ ] Screenshots profesionales
- [ ] Demo GIF smooth

### Deployment - Vercel
- [ ] Repository conectado
- [ ] Environment variables configuradas
- [ ] Build exitoso
- [ ] URL production funcionando
- [ ] Demo data seeded en Supabase
- [ ] HTTPS habilitado
- [ ] Custom domain (opcional)

### Deployment - Docker
- [ ] Dockerfile optimizado (multi-stage)
- [ ] Docker build exitoso
- [ ] Imagen testeada localmente
- [ ] Push a Docker Hub
- [ ] Tag con versión (v1.0.0)
- [ ] Docker Compose configurado
- [ ] Health check funcionando
- [ ] DOCKER.md completo

### Links y URLs
- [ ] README actualizado con URL Vercel
- [ ] README con link a Docker Hub
- [ ] GitHub About section con URLs
- [ ] DEPLOYMENT.md con URLs reales
- [ ] Badges actualizados con links reales

---

## 🎯 RESULTADO ESPERADO

Al completar este plan, tendrás:

✅ **README que vende:**
- Header impactante
- Demo en vivo en Vercel
- Docker Hub link
- Screenshots profesionales
- Tech stack destacado
- Easy to clone & run

✅ **Documentación completa:**
- Architecture explained
- API documented
- Security covered
- Testing shown
- Docker deployment guide
- Vercel deployment guide

✅ **GitHub optimizado:**
- Professional appearance
- Easy to navigate
- Clear contribution guide
- Issue templates ready
- Topics: nextjs, typescript, docker, vercel

✅ **Portfolio-ready:**
- Demuestra skills técnicos
- Muestra best practices
- Code quality visible
- Professional presentation
- Production deployment
- Container orchestration

✅ **Múltiples opciones de deployment:**
- **Vercel (Cloud):** URL live para demo rápido
- **Docker (Self-hosted):** Imagen portable para cualquier infraestructura
- **Local Dev:** Setup simple con docker-compose

---

## 📊 BADGES PARA README

Agregar estos badges al completar cada fase:

```markdown
<!-- Build & Deploy -->
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?logo=docker)
![Build](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)

<!-- Stack -->
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-DB-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

<!-- Quality -->
![Tests](https://img.shields.io/badge/Tests-57%20passing-success)
![Coverage](https://img.shields.io/badge/Coverage-80%25-green)
![License](https://img.shields.io/badge/License-MIT-green)

<!-- Stats -->
![Docker Pulls](https://img.shields.io/docker/pulls/username/studio-demo)
![GitHub Stars](https://img.shields.io/github/stars/username/studio-demo)
```

---

## ⚡ QUICK START (Orden recomendado)

**DÍA 1 (5-6 horas):**
1. Vercel Deploy (45 min) 🔴 **PRIORITARIO**
2. Screenshots (45 min)
3. README.md con URLs reales (45 min)
4. Logo/Branding (30 min)
5. Docker Build & Push (60 min) 🔴 **PRIORITARIO**
6. DOCKER.md (30 min)
7. DEPLOYMENT.md (30 min)
8. GitHub setup (30 min)

**DÍA 2 (3-4 horas):**
9. FEATURES.md (30 min)
10. ARCHITECTURE.md (45 min)
11. API.md (30 min)
12. SECURITY.md (25 min)
13. Demo GIF (20 min)
14. Code cleanup (15 min)
15. Docker Compose prod (20 min)
16. Final testing (45 min)

---

## 🎯 FLUJO DE DEPLOYMENT

```
┌─────────────────────────────────────────────────┐
│  1. GitHub Repository (código limpio)          │
└────────────┬────────────────────────────────────┘
             │
             ├──────────────────┬─────────────────
             │                  │
             ▼                  ▼
┌────────────────────┐  ┌──────────────────────┐
│  Vercel Deploy     │  │  Docker Build        │
│  (Production)      │  │  (Image Creation)    │
├────────────────────┤  ├──────────────────────┤
│ • Auto deploy      │  │ • Multi-stage build  │
│ • Edge network     │  │ • Optimized layers   │
│ • SSL auto         │  │ • Health checks      │
│ • Custom domain    │  │ • Alpine base        │
└────────────────────┘  └──────────┬───────────┘
             │                     │
             │                     ▼
             │          ┌─────────────────────┐
             │          │   Docker Hub Push   │
             │          │   (Public Registry) │
             │          ├─────────────────────┤
             │          │ • username/studio   │
             │          │ • Latest tag        │
             │          │ • Version tags      │
             │          └─────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│  Live Demo URLs:                                │
│  • Vercel: https://studio-demo.vercel.app      │
│  • Docker: docker pull username/studio-demo    │
└─────────────────────────────────────────────────┘
```

---

## 📞 NEXT STEPS

¿Por dónde empezamos?

**Opción A: README First** (recomendado)
- Crear README profesional
- Screenshots principales
- Deploy a Vercel
- Actualizar URL

**Opción B: Visual First**
- Logo y branding
- Screenshots completos
- Demo GIF
- Luego documentación

**Opción C: Full Documentation**
- Todos los .md files
- Diagramas
- API docs
- Luego visual

¿Cuál prefieres?
