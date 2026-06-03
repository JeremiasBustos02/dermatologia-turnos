# 📋 Requirements

## Funcionalidades del Cliente (Frontend)

### 1. Autenticación
- Formulario de Login validado (DNI/Contraseña).
- Persistencia de sesión con Refresh Tokens.
- Guardado seguro en `localStorage`.

### 2. Dashboard del Paciente
- Visualización de turnos propios (próximos y pasados).
- Generación de nuevo turno con buscador de disponibilidad.
- Cancelación de turnos.

### 3. Dashboard Administrativo
- CRUD completo de Profesionales, Especialidades y Coberturas.
- Visualización de agenda diaria y semanal.
- Gestión de estados de turnos (Confirmar/Cancelar).

## Requerimientos No Funcionales
- **Responsive:** Diseño adaptado para celulares (pacientes) y escritorios (recepción/profesionales).
- **Rendimiento:** Carga inicial rápida (usando Lazy Loading de rutas).
- **Accesibilidad:** Uso de elementos semánticos de HTML y contrastes de color adecuados según el Design System.