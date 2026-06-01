# API

## Specialties

### POST /specialties

Crear especialidad.

### GET /specialties

Listar especialidades.

### GET /specialties/:id

Obtener especialidad.

### PATCH /specialties/:id

Actualizar especialidad.

### DELETE /specialties/:id

Eliminar especialidad.

---

## Coverages

### POST /coverages

Crear cobertura.

### GET /coverages

Listar coberturas.

### GET /coverages/:id

Obtener cobertura.

### PATCH /coverages/:id

Actualizar cobertura.

### DELETE /coverages/:id

Eliminar cobertura.

---

## Professionals

### POST /professionals

Crear profesional.

### GET /professionals

Listar profesionales.

### GET /professionals/:id

Obtener profesional.

### PATCH /professionals/:id

Actualizar profesional.

### DELETE /professionals/:id

Eliminar profesional.

---

## Schedules

### POST /schedules

Crear horario.

### GET /schedules

Listar horarios.

### GET /schedules/:id

Obtener horario.

### PATCH /schedules/:id

Actualizar horario.

### DELETE /schedules/:id

Eliminar horario.

---

## Users

### POST /users

Crear usuario.

### GET /users

Listar usuarios.

### GET /users/:id

Obtener usuario.

### PATCH /users/:id

Actualizar usuario.

### DELETE /users/:id

Eliminar usuario.

---

## Appointments

### POST /appointments

Crear turno.

Validaciones:

* paciente existente
* profesional existente
* cobertura existente
* cobertura aceptada
* sin duplicados

### GET /appointments

Listar turnos.

### GET /appointments/:id

Obtener turno.

### PATCH /appointments/:id

Actualizar turno.

### DELETE /appointments/:id

Eliminar turno.

---

## Futuro

### POST /auth/login

Inicio de sesión.

### GET /appointments/available-slots

Horarios disponibles.

### PATCH /appointments/:id/confirm

Confirmar turno.

### PATCH /appointments/:id/cancel

Cancelar turno.

### PATCH /appointments/:id/complete

Completar turno.
