import { apiFetch } from "./api.js";
import { mostrarLoader } from "./loader.js";

// Conecta el botón "Cerrar sesión" del header, su modal de confirmación y la
// llamada real a POST /auth/signout. No hace nada si la página no tiene
// estos elementos (autoinicializa al importarse, igual que confirm-modal.js).
function inicializar() {
    const botonCerrarSesion   = document.getElementById("btn-cerrar-sesion");
    const modalCerrarSesion   = document.getElementById("modalCerrarSesion");
    const botonCancelarSalir  = document.getElementById("btnCancelarSalir");
    const botonConfirmarSalir = document.getElementById("btnConfirmarSalir");

    if (botonCerrarSesion && modalCerrarSesion) {
        botonCerrarSesion.addEventListener("click", function () {
            modalCerrarSesion.classList.add("mostrar");
        });
    }

    if (botonCancelarSalir && modalCerrarSesion) {
        botonCancelarSalir.addEventListener("click", function () {
            modalCerrarSesion.classList.remove("mostrar");
        });
    }

    if (botonConfirmarSalir) {
        botonConfirmarSalir.addEventListener("click", async function () {
            mostrarLoader();
            try {
                await apiFetch("/auth/signout", { method: "POST" });
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
            window.location.href = "../login/indexpri.html";
        });
    }
}

inicializar();
