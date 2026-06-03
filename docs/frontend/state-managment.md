# 🧠 State Management

Para mantener una arquitectura limpia y eficiente, se divide su estrategia de estado en tres capas bien definidas.

## 1. Estado de Servidor (Server State)
Para manejar los datos que vienen del backend (turnos, usuarios, listas de profesionales), **NO utilizaremos `useState` o `Context API` puro**.

* **Solución:** **TanStack Query (React Query)**.
* **Por qué:** Maneja automáticamente el caché, la invalidación de datos, los estados de carga (`isLoading`), los errores y la revalidación.
* **Uso:** Cualquier llamada que involucre un `GET` a la API debe pasar por un `useQuery` o `useMutation`.

## 2. Estado Global de Aplicación (Global Client State)
Para datos que necesitan ser accedidos desde múltiples partes de la app (ej. el perfil del usuario logueado, los tokens JWT, preferencias de tema).

* **Solución:** **Zustand**.
* **Por qué:** Es increíblemente ligero, requiere mucho menos código que Redux, y es muy fácil de tipar con TypeScript.
* **Ejemplo:** `useAuthStore` para guardar el estado de sesión y el token de acceso.

## 3. Estado Local de UI (Local Component State)
Para datos que solo importan dentro de un componente o una vista pequeña.

* **Solución:** `useState`, `useReducer` o `useForm` (de la librería **React Hook Form**).
* **Nota:** Si un formulario tiene más de 3 campos, es obligatorio usar **React Hook Form** con **Zod** para la validación del esquema. Esto garantiza que lo que el usuario escribe en el front coincida con los DTOs de tu backend.

---

## Estrategia de Persistencia
* Los tokens (Access y Refresh) se manejarán mediante el `AuthStore` y se persistirán en **LocalStorage**.
* El resto del estado global se reinicia al recargar la página para evitar inconsistencias con la base de datos.