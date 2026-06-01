# Arquitectura

## Stack

Backend:

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL

Frontend (planeado):

* React
* TypeScript
* TailwindCSS

---

## Estructura

src/

* common/
* modules/
* prisma/

Cada módulo contiene:

* controller
* service
* dto
* module

---

## Flujo para crear un turno

1. Recibir solicitud.
2. Validar DTO.
3. Verificar paciente.
4. Verificar profesional.
5. Verificar cobertura.
6. Verificar cobertura aceptada.
7. Verificar disponibilidad.
8. Crear turno.

---

## Validaciones

### DTO

Utilizando:

* class-validator
* ValidationPipe

### Base de datos

Utilizando:

* Prisma
* Restricciones UNIQUE
* Relaciones

### Negocio

Utilizando:

* BadRequestException
* NotFoundException

---

## Estrategia de ramas

main:
Código estable.

feature/*:
Nuevas funcionalidades.

Ejemplos:

* feature/specialties
* feature/coverages
* feature/professionals
* feature/schedules
* feature/appointments
* feature/auth
