# Sistema de Turnos Médicos (Dermatología)

API RESTful diseñada para la gestión integral de un consultorio médico, administrando pacientes, profesionales, obras sociales, agendas de horarios y turnos. Construida con un enfoque estricto en validaciones de reglas de negocio, manejo de zonas horarias y seguridad.

## 🚀 Tecnologías

- **Backend:** NestJS (TypeScript)
- **Frontend:** React + Vite + TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT (Passport)
- **Fechas y Timezones:** Day.js
- **Documentación:** Swagger (OpenAPI)

---

## 📁 Estructura del proyecto

```
/backend   → API NestJS
/frontend  → Aplicación React
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd <nombre-del-proyecto>
```

---

### 2. Backend (API)

```bash
cd backend
npm install
```

#### Configurar variables de entorno

Crear un archivo `.env` en la carpeta `backend`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="tu_secreto"
```

#### Migraciones de base de datos (Prisma)

```bash
npx prisma migrate dev
npx prisma generate
```

#### Levantar backend en desarrollo

```bash
npm run start:dev
```

Backend en:
http://localhost:3000

---

### 3. Frontend (React)

```bash
cd frontend
npm install
```

#### Variables de entorno (si aplica)

Crear `.env` en `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

#### Levantar frontend en desarrollo

```bash
npm run dev
```

Frontend en:
http://localhost:5173

---

## ✨ Características Principales

- Autenticación y Autorización (RBAC) con JWT (`ADMIN`, `RECEPTIONIST`, `PATIENT`)
- Motor de agendas dinámico según disponibilidad de profesionales
- Manejo de zonas horarias con normalización a UTC
- Prevención de conflictos de turnos superpuestos
- Validaciones estrictas de reglas de negocio
- Manejo centralizado de errores con filtros globales

---

## 🛠️ Scripts útiles

### Backend
- npm run start:dev → desarrollo
- npm run build → producción
- npm run start:prod → producción
- npx prisma studio → visualizar DB

### Frontend
- npm run dev → desarrollo
- npm run build → build producción
- npm run preview → previsualización
