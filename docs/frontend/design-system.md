# 🎨 Design System

Este documento establece las reglas de estilo y la paleta visual para mantener la coherencia en toda la interfaz de Lumera, utilizando **TailwindCSS**.

## 1. Paleta de Colores
Buscamos una paleta "médica" que evoque profesionalismo y tranquilidad.

* **Primary (Azul Clínico):** `blue-600` (#2563eb) - Para acciones principales (botones de confirmar, headers).
* **Secondary (Turquesa Salud):** `teal-500` (#14b8a6) - Para estados positivos, turnos confirmados.
* **Danger (Alerta):** `rose-600` (#e11d48) - Para acciones de cancelación o borrado (usar con moderación).
* **Background (Limpieza):** `slate-50` (#f8fafc) - Fondo de la aplicación.
* **Surface (Contenedores):** `white` - Tarjetas y formularios.
* **Text (Legibilidad):** `slate-900` para títulos, `slate-600` para textos secundarios.

## 2. Tipografía
* **Fuente:** `Inter` (Google Fonts). Es limpia, moderna y altamente legible en pantallas de escritorio y dispositivos móviles.
* **Jerarquía:**
    * `h1`: 2rem (32px), semibold.
    * `h2`: 1.5rem (24px), medium.
    * `body`: 0.875rem (14px), regular.

## 3. Componentes Base (Tailwind Rules)
Para mantener la consistencia, todos los componentes deben seguir estas reglas:

* **Botones:**
    * `px-4 py-2 rounded-lg font-medium transition-all`
    * Uso de `opacity-90 hover:opacity-100` para feedback.
* **Tarjetas (Cards):**
    * `bg-white rounded-xl shadow-sm border border-slate-200 p-6`
* **Inputs:**
    * `w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`

## 4. Estrategia de Responsive
Lumera sigue un enfoque **Mobile-First**:
1.  **Mobile:** Pantalla completa, menús ocultos bajo botones hamburguesa.
2.  **Desktop:** Sidebar lateral fija (o colapsable) y contenido principal en grid.

## 5. Librería de UI
Se utilizará **TailwindCSS** puro para la mayoría de los componentes, complementado con **Heroicons** para los íconos del sistema. Si el proyecto requiere componentes complejos (DatePickers, Modales complejos), se evaluará la implementación de **shadcn/ui** por su flexibilidad y bajo acoplamiento.