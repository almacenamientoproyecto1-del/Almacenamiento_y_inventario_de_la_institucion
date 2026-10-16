import { apiFetch } from "../../scripts/api.js";
import { mostrarLoader, ocultarLoader } from "../../scripts/loader.js";

const form = document.querySelector("#form-login");
const errorBox = document.querySelector("#login-error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#password").value;
    errorBox.textContent = "";
    mostrarLoader();

    try {
        await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                correo: email,
                contraseña: pass
            })
        });

        window.location.href = "../panel_principal/index1.html";
    } catch (error) {
        ocultarLoader();
        errorBox.textContent = error.message || "No se pudo iniciar sesión.";
    }
});
