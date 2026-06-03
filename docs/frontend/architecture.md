# 🏛️ Arquitectura del Frontend

Este documento define la estructura y las decisiones arquitectónicas para el frontend, construido con **React, TypeScript, Vite y TailwindCSS**. 

El objetivo principal es mantener un código escalable, predecible y altamente tipado, facilitando el mantenimiento a medida que el sistema de turnos y agendas crezca.

## 📁 Estructura de Carpetas (Feature-based)

Se adopta una estructura orientada a funcionalidades (features). Todo lo relacionado a un dominio específico (por ejemplo, "Turnos" o "Autenticación") vive en su propia carpeta.

\`\`\`text
src/
├── assets/         # Imágenes estáticas, íconos y logos globales.
├── components/     # Componentes UI reutilizables (Botones, Modales, Inputs). "Dumb components".
├── config/         # Configuraciones globales (variables de entorno, constantes).
├── features/       # Módulos de negocio (El corazón de la app).
│   ├── auth/       # -> Login, registro, recuperación de contraseña.
│   ├── appointments/# -> Lógica, vistas y hooks de los turnos.
│   ├── patients/   # -> ABM de pacientes.
│   └── schedules/  # -> Gestión de agendas de los profesionales.
├── hooks/          # Custom hooks globales (ej. useWindowSize, useTheme).
├── layouts/        # Envoltorios de páginas (DashboardLayout, AuthLayout).
├── routes/         # Configuración de React Router (Públicas, Privadas, Guards).
├── services/       # Integración con la API (Axios/Fetch), interceptores.
├── store/          # Manejo de estado global (Zustand/Context).
├── types/          # Interfaces y tipos globales de TypeScript.
└── utils/          # Funciones de ayuda (formateo de fechas con dayjs, validaciones).
\`\`\`

## 🧩 Anatomía de un Feature

Cada carpeta dentro de `src/features/` es un mini-módulo independiente que agrupa su propia lógica. Por ejemplo, `src/features/appointments/` contendrá:

* `/components`: Componentes exclusivos de turnos (ej. `AppointmentCard`).
* `/hooks`: Lógica de React exclusiva (ej. `useAppointments`).
* `/services`: Llamadas a la API específicas de este módulo.
* `/types`: Interfaces de TypeScript (`Appointment`, `CreateAppointmentDTO`).
* `/views` o `/pages`: Las pantallas completas que se renderizan en el Router.

## 🛣️ Estrategia de Enrutamiento (Routing)

Se utilizará **React Router DOM**. Las rutas estarán divididas en dos grandes grupos mediante "Guards" (Componentes de orden superior):

1.  **Rutas Públicas (`<PublicRoute />`):** Solo accesibles si no hay sesión iniciada. (ej. `/login`). Si un usuario autenticado intenta entrar, se lo redirige al Dashboard.
2.  **Rutas Privadas (`<ProtectedRoute />`):** Requieren un JWT válido en el estado global. Si el usuario no está logueado o el token expiró, se lo redirige al Login. Además, soportarán validación basada en roles (`ADMIN`, `RECEPTIONIST`, `PATIENT`).

## 🧱 Patrón de Componentes: "Smart vs Dumb"

Para mantener la UI limpia y testeable, aplicaremos la separación de responsabilidades:

* **Dumb Components (Presentacionales):** Reciben datos por `props` y emiten eventos. No saben de dónde vienen los datos. Viven en `src/components`. (Ej: Un botón genérico, una tabla).
* **Smart Components (Contenedores/Páginas):** Se conectan al estado global, llaman a la API, manejan la lógica de negocio y le pasan los datos a los Dumb Components. Viven en las carpetas `features/*/views`.