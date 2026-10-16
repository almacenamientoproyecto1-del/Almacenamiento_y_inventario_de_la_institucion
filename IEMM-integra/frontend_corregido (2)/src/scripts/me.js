// Guard de sesión para páginas protegidas. Es un script clásico (no un
// módulo) a propósito: debe ejecutarse de inmediato, de forma síncrona, para
// mostrar el loader ANTES del primer render y evitar el parpadeo de
// contenido protegido antes del redirect a login. La lógica de sesión y el
// loader (que sí son módulos) se cargan con import() dinámico.
document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", async () => {
    const { mostrarLoader, ocultarLoader } = await import("./loader.js");
    mostrarLoader();

    try {
        const { obtenerUsuarioActual } = await import("./session.js");
        await obtenerUsuarioActual();
        document.documentElement.style.visibility = "visible";
        ocultarLoader();
    } catch (error) {
        window.location.href = "../login/indexpri.html";
    }
});
