# Requerimientos del Sistema

## Descripción

Sistema de gestión de turnos para un consultorio dermatológico.

Permitirá administrar:

* Pacientes
* Profesionales
* Especialidades
* Coberturas médicas
* Horarios de atención
* Turnos

---

## Roles

### Administrador

Puede:

* Gestionar profesionales
* Gestionar especialidades
* Gestionar coberturas
* Gestionar horarios
* Gestionar usuarios
* Ver todos los turnos

### Recepcionista

Puede:

* Registrar pacientes
* Buscar pacientes
* Crear turnos
* Cancelar turnos
* Confirmar turnos
* Ver agenda de profesionales

### Paciente

En una futura versión:

* Iniciar sesión
* Ver sus turnos
* Solicitar turnos
* Cancelar turnos

---

## Reglas de negocio

### Profesionales

* Un profesional puede tener múltiples especialidades.
* Un profesional puede aceptar múltiples coberturas.
* Un profesional puede tener múltiples horarios de atención.

### Horarios

* Cada horario pertenece a un único profesional.
* El horario se define por:

  * Día de la semana
  * Hora de inicio
  * Hora de fin
  * Duración de turno

### Turnos

* Un turno pertenece a:

  * Un paciente
  * Un profesional
  * Una cobertura

* El paciente debe existir.

* El profesional debe existir.

* La cobertura debe existir.

* El profesional debe aceptar dicha cobertura.

* No pueden existir dos turnos en la misma fecha y hora para el mismo profesional.

* El turno debe respetar los horarios configurados para el profesional.

---

## Estados de turno

* PENDING
* CONFIRMED
* COMPLETED
* CANCELLED
