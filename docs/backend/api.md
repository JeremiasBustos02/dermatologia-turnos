## Auth
### POST /auth/login
Inicio de sesión. Devuelve el JWT.
### GET /auth/me
Obtiene los datos del usuario logueado.

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
* validación de horarios disponibles

### GET /appointments
Listar turnos.

### GET /appointments/:id
Obtener turno.

### PATCH /appointments/:id
Actualizar turno.

### PATCH /appointments/:id/confirm
Confirmar turno (Pasa a CONFIRMED).

### PATCH /appointments/:id/cancel
Cancelar turno (Pasa a CANCELLED).

### PATCH /appointments/:id/complete
Completar turno (Pasa a COMPLETED).

### GET /appointments/available-slots
Obtener horarios disponibles por profesional y fecha.