// Cliente HTTP mínimo hacia el backend: agrega la URL base, manda cookies de
// sesión y traduce errores del servidor a un Error con mensaje legible.

export const API_URL = "http://localhost:3000";

export async function apiFetch(ruta, opciones) {
    const config = Object.assign({}, opciones);
    config.headers = Object.assign({ "Content-Type": "application/json" }, opciones && opciones.headers);
    config.credentials = "include";

    const respuesta = await fetch(API_URL + ruta, config);

    if (respuesta.status === 204) return null;  

    const datos = await respuesta.json().catch(function () { return null; });

    if (!respuesta.ok) {
        const mensaje = (datos && datos.error) ? datos.error : "Error al comunicarse con el servidor.";
        throw new Error(mensaje);
    }

    return datos;
}
