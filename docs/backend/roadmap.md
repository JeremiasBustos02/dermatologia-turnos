---

`roadmap.md` 

```markdown
# Roadmap del Proyecto

## ✅ Fase 1: Infraestructura y Base (COMPLETADO)
- [x] Setup NestJS + Prisma + PostgreSQL
- [x] Configuración de DTOs y ValidationPipe
- [x] Manejo global de excepciones (PrismaExceptionFilter)
- [x] Documentación interactiva con Swagger y configuración de CORS
- [x] Autenticación con JWT (AuthModule, JwtStrategy)
- [x] Autorización basada en Roles (RolesGuard, Roles Decorator)

## ✅ Fase 2: Módulos Core (COMPLETADO)
- [x] **Usuarios:** CRUD, encriptación bcrypt, búsqueda por DNI y filtros.
- [x] **Catálogos:** CRUD de Especialidades y Coberturas Médicas (Obras Sociales).
- [x] **Profesionales:** CRUD, relación N:M con especialidades y coberturas.
- [x] **Agendas (Schedules):** Configuración de días de atención, rango horario y duración de turnos. Validación de superposiciones.

## ✅ Fase 3: Motor de Turnos (COMPLETADO)
- [x] Búsqueda de franjas horarias disponibles (`/available-slots`).
- [x] Normalización de Zonas Horarias (Timezones) con `dayjs` (evita desfasajes internacionales).
- [x] Creación de turnos con validación estricta (paciente, profesional, obra social coincidente).
- [x] Filtro anti-duplicados y validación de horarios fuera de agenda.
- [x] Transiciones de estado lógicas (`PENDING` -> `CONFIRMED` -> `COMPLETED` / `CANCELLED`).

---

## 🚧 Fase 4: Refinamiento Backend (En progreso - "Camino A")
- [ ] **Soft Delete:** Implementar borrado lógico en tablas clave (Usuarios, Profesionales, Turnos) mediante Prisma Extensions o Middleware para mantener la integridad histórica.
- [ ] **Rate Limiting:** Implementar `ThrottlerModule` para proteger endpoints sensibles (como `/auth/login`) contra ataques de fuerza bruta.
- [ ] **Seguridad HTTP:** Configurar `Helmet` para proteger las cabeceras HTTP.
- [ ] **Paginación:** Agregar metadatos de paginación (`page`, `limit`, `total`) en los endpoints `findAll` de usuarios y turnos.
- [ ] **Auditoría Básica / Logs:** Implementar un logger profesional (ej. Winston o Pino) para registrar acciones críticas (turnos cancelados, logins fallidos).

---

## 🗓️ Fase 5: Frontend (Pendiente)
- [ ] Inicializar proyecto React + TypeScript + Vite.
- [ ] Configurar TailwindCSS.
- [ ] Pantalla de Login y manejo de sesión (Almacenamiento seguro del JWT).
- [ ] Dashboard Principal.
- [ ] Vistas de ABM (Usuarios, Profesionales, Especialidades).
- [ ] Vista de Agenda Diaria y Calendario interactivo.

## 🔮 Fase 6: Funcionalidades Futuras
- [ ] Refresh Tokens.
- [ ] Recordatorios automatizados por Email (Nodemailer).
- [ ] Recordatorios automatizados por WhatsApp.