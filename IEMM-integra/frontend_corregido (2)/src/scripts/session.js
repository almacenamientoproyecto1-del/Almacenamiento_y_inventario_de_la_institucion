import { apiFetch } from "./api.js";

// Cachea GET /auth/me para que cualquier página protegida pueda leer el
// usuario logueado (id, cargo, etc.) sin repetir el fetch en cada uso.
let usuarioActualCache = null;

export async function obtenerUsuarioActual() {
    if (usuarioActualCache) return usuarioActualCache;
    usuarioActualCache = await apiFetch("/auth/me");
    return usuarioActualCache;
}
