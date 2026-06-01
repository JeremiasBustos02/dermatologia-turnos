# Base de Datos

## User

Representa usuarios del sistema.

Campos:

* id
* dni
* firstName
* lastName
* email
* password
* role

Roles:

* PATIENT
* RECEPTIONIST
* ADMIN

---

## Professional

Representa médicos dermatólogos.

Campos:

* id
* firstName
* lastName
* licenseNumber

Relaciones:

* specialties
* coverages
* schedules
* appointments

---

## Specialty

Especialidades médicas.

Ejemplos:

* Dermatología Clínica
* Dermatología Pediátrica
* Cirugía Dermatológica

---

## Coverage

Obras sociales o prepagas.

Ejemplos:

* OSDE
* Swiss Medical
* IOMA

---

## Schedule

Disponibilidad semanal de un profesional.

Campos:

* professionalId
* dayOfWeek
* startTime
* endTime
* appointmentDuration

Ejemplo:

MONDAY
08:00
12:00
20 minutos

---

## Appointment

Turnos médicos.

Campos:

* patientId
* professionalId
* coverageId
* dateTime
* status
* notes

Estados:

* PENDING
* CONFIRMED
* COMPLETED
* CANCELLED

---

## Relaciones

Professional ↔ Specialty
(Muchos a muchos)

Professional ↔ Coverage
(Muchos a muchos)

Professional → Schedule
(Uno a muchos)

User → Appointment
(Uno a muchos)

Professional → Appointment
(Uno a muchos)

Coverage → Appointment
(Uno a muchos)
