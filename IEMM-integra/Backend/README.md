# API de Inventario - I.E.M.M

API REST para el control de implementos (inventario) de la institución, construida con **Express**, **Prisma ORM** y **PostgreSQL**.

## Requisitos

- Node.js 20.19 o superior
- Una base de datos PostgreSQL (local o en la nube)

## Instalación

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de variables de entorno copiando el ejemplo:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y coloca tu cadena de conexión real:

   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
   ```

3. Aplica las migraciones a la base de datos (esto crea todas las tablas):

   ```bash
   npx prisma migrate deploy
   ```

4. Genera el cliente de Prisma:

   ```bash
   npx prisma generate
   ```

## Ejecución

```bash
npm run dev     
```

El servidor queda disponible en `http://localhost:3000` (o el puerto indicado en `PORT`).

## Autenticación

- `POST /auth/login` — body `{ "correo", "contraseña" }`. Devuelve el usuario (sin contraseña) y un JWT, tanto en una cookie `httpOnly` como en el cuerpo de la respuesta (`token`).
- `GET /auth/me` — requiere sesión. Devuelve los datos del usuario autenticado.
- `POST /auth/signout` — limpia la cookie de sesión.

El token se puede enviar de dos formas (ambas soportadas por el middleware):

- Cookie `httpOnly` `token` (la que pone `/auth/login` automáticamente; requiere `credentials: "include"` en `fetch`/axios desde el navegador).
- Header `Authorization: Bearer <token>` (útil para Postman, apps móviles, etc.).

### Primer usuario (bootstrap)

También existe `POST /auth/registrar` como registro público. Para crear el administrador inicial mediante las variables `SEED_ADMIN_*`, ejecuta:

```bash
npm run seed
```

Esto crea (o actualiza) un usuario administrador con cargo `RECTOR` usando las variables `SEED_ADMIN_CORREO`, `SEED_ADMIN_CONTRASENA` y `SEED_ADMIN_DOCUMENTO` del `.env` (o los valores por defecto si no están definidas). **Cambia esa contraseña después del primer login.**

## Endpoints disponibles

Todos siguen el mismo patrón CRUD (`GET`, `POST`, `PUT /:id`, `DELETE /:id`) y **requieren estar autenticado** (JWT válido, ver sección de Autenticación):

- `/usuario`
- `/ubicacion`
- `/responsable`
- `/proveedor`
- `/implemento`
- `/categoria`

## Notas técnicas

- CORS permite los orígenes definidos en `CORS_ORIGINS` (separados por comas; por defecto `http://localhost:5500`) con `credentials: true`.
- Los errores de base de datos (duplicados, registros no encontrados, relaciones en uso) se traducen a mensajes claros en español con el código HTTP correspondiente; cualquier otro error no reconocido se registra en el servidor pero no expone su detalle interno al cliente.
- El campo `contraseña` de `Usuario` se guarda hasheado con `bcryptjs` (10 rondas de sal) y nunca se incluye en las respuestas de la API (`POST/GET/PUT /usuario`, `/auth/login`, `/auth/me`).
- Variables de entorno nuevas: `JWT_SECRET` (obligatoria, firma los tokens), `JWT_EXPIRES_IN` (opcional, por defecto `8h`), y `SEED_ADMIN_*` (opcionales, usadas solo por `npm run seed`).

## Lecturas y verificación

- `GET /implemento` incluye proveedor, ubicación, categoría, usuario (sin contraseña) y responsables.
- `GET /responsable` incluye su implemento.
- `GET /movimiento` devuelve el historial, ordenado del más reciente al más antiguo. `?limite=N` acepta enteros entre 1 y 1000.
- Un listado vacío se devuelve como `[]` con HTTP 200. Los listados de recursos corresponden a todos los registros, incluidos usuarios inactivos.
- Los cuerpos deben contener los campos escalares del esquema, sin `id` ni escrituras de relaciones anidadas. Los IDs de ruta deben ser enteros positivos; las cantidades y capacidades no pueden ser negativas.
- La API comprueba PostgreSQL antes de iniciar. Un usuario eliminado o inactivo no puede utilizar su token.

Ejecuta `npm run verify:endpoints` para comparar todos los listados y sus campos contra PostgreSQL, comprobar relaciones, autenticación y entradas inválidas. Requiere un usuario activo y no modifica registros. No prueba altas, actualizaciones o borrados válidos ni contraseñas reales de login.

Si una base anterior tiene `_prisma_migrations.id` de tipo UUID, Prisma no puede leer el historial. El archivo `scripts/reparar-historial.sql` convierte ese campo a VARCHAR(36), conservando sus valores. Después, `npm run prisma:deploy` aplica las migraciones pendientes; no uses un reset para esta reparación.
