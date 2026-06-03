# Sistema de Turnos Médicos (Dermatología)

API RESTful diseñada para la gestión integral de un consultorio médico, administrando pacientes, profesionales, obras sociales, agendas de horarios y turnos. Construida con un enfoque estricto en validaciones de reglas de negocio, manejo de zonas horarias y seguridad.

## 🚀 Tecnologías

* **Framework:** NestJS
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL
* **ORM:** Prisma
* **Autenticación:** JWT (Passport)
* **Fechas y Timezones:** Day.js
* **Documentación:** Swagger (OpenAPI)

## ✨ Características Principales

* **Autenticación y Autorización (RBAC):** Accesos protegidos por JWT y control de roles (`ADMIN`, `RECEPTIONIST`, `PATIENT`).
* **Motor de Agendas:** Generación dinámica de franjas horarias disponibles según la configuración de días, horarios y duración de turnos de cada profesional.
* **Manejo Global de Zonas Horarias:** Normalización de fechas a UTC en base de datos y cálculos precisos adaptados a la zona horaria del consultorio (Argentina), permitiendo interacciones desde cualquier huso horario sin desfases.
* **Prevención de Conflictos:** Bloqueo algorítmico de turnos superpuestos y validación estricta de coberturas médicas aceptadas por el profesional.
* **Manejo Centralizado de Errores:** Filtros de excepciones personalizados para capturar y traducir errores de base de datos a respuestas HTTP amigables.

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio y descargar dependencias:**
   ```bash
   git clone <tu-repo-url>
   cd backend
   npm install