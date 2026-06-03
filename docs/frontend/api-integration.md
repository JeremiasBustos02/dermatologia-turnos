# 🌐 API Integration - Lumera

La comunicación con la API se realiza a través de **Axios**, configurado para manejar automáticamente la autenticación y la revalidación de tokens.

## 1. Configuración Base
Se define una instancia única de Axios (`apiClient`) para centralizar la configuración:
- `baseURL`: Obtenido de `import.meta.env.VITE_API_URL`.
- `headers`: `Content-Type: application/json`.

## 2. Interceptores (La magia)
Para evitar repetir lógica en cada componente, implementamos dos interceptores fundamentales:

### Interceptor de Request (Inyectar Token)
Antes de cada petición, el interceptor busca el `accessToken` en el `AuthStore` y lo añade al header `Authorization: Bearer <token>`.

### Interceptor de Response (Manejo de 401)
Cuando la API responde un `401 Unauthorized`:
1. El interceptor frena la petición.
2. Llama al endpoint `POST /auth/refresh` usando el `refreshToken` almacenado.
3. Si el refresh tiene éxito:
    - Actualiza el nuevo `accessToken` en el estado global.
    - Reintenta la petición original con el nuevo token.
4. Si el refresh falla (token expirado o revocado):
    - Limpia el estado global (logout).
    - Redirige al usuario al `/login`.

## 3. Servicios (Abstracción)
Cada módulo tiene su propio archivo de servicio en `src/services/`.
Ejemplo: `appointment.service.ts`
- `getAvailableSlots(professionalId, date)`
- `createAppointment(data)`
- `findAll(params)`

## 4. Tipado de API (DTOs)
Para mantener la consistencia con el Backend, todas las respuestas de la API están tipadas mediante interfaces en `src/types/api.d.ts` que espejan los DTOs de NestJS.