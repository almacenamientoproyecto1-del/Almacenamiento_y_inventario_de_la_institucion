import { apiFetch } from "../../scripts/api.js";
import { exportarCSV } from "../../scripts/csv.js";
import { confirmarEliminar } from "../../scripts/confirm-modal.js";
import { CARGOS_USUARIO } from "../../scripts/constants.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";

function crearFilaUsuario(usuario) {
    const tr = document.createElement("tr");
    tr.dataset.id = usuario.id;
    const claseEstado = usuario.activo === false ? "inactivo" : "activo";
    const textoEstado = usuario.activo === false ? "Inactivo" : "Activo";
    tr.innerHTML =
        "<td>" + usuario.nombre + " " + usuario.apellido + "</td>" +
        "<td>" + usuario.correo + "</td>" +
        "<td>" + usuario.documento + "</td>" +
        "<td>" + (CARGOS_USUARIO[usuario.cargo] || usuario.cargo) + "</td>" +
        "<td class='" + claseEstado + "'>" + textoEstado + "</td>" +
        "<td><button class='editar'>Editar</button><button class='eliminar'>X</button></td>";
    return tr;
}

let ultimosUsuarios = [];

async function cargarUsuarios() {
    const tbody = document.getElementById("tabla-usuarios");
    tbody.innerHTML = "<tr><td colspan='6'>Cargando usuarios...</td></tr>";
    try {
        const usuarios = await apiFetch("/usuario");
        ultimosUsuarios = usuarios;
        tbody.innerHTML = "";

        if (!usuarios.length) {
            tbody.innerHTML = "<tr><td colspan='6'>Todavía no hay usuarios registrados.</td></tr>";
            return;
        }

        usuarios.forEach(function (usuario) {
            tbody.appendChild(crearFilaUsuario(usuario));
        });
        filtrarUsuarios();
    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='6'>No se pudo conectar con la API: " + error.message + "</td></tr>";
    }
}

const inputBuscar = document.getElementById("buscar-usuario");

function filtrarUsuarios() {
    const texto = inputBuscar.value.toLowerCase();
    document.querySelectorAll("#tabla-usuarios tr[data-id]").forEach(function (fila) {
        const nombre = fila.cells[0].textContent.toLowerCase();
        const correo = fila.cells[1].textContent.toLowerCase();
        fila.style.display =
            (nombre.includes(texto) || correo.includes(texto)) ? "" : "none";
    });
}

inputBuscar.addEventListener("keyup", filtrarUsuarios);
document.getElementById("btn-buscar").addEventListener("click", filtrarUsuarios);
document.getElementById("btn-actualizar").addEventListener("click", cargarUsuarios);

function filasVisiblesComoCSV() {
    const filas = [];
    document.querySelectorAll("#tabla-usuarios tr[data-id]").forEach(function (fila) {
        if (fila.style.display === "none") return;
        filas.push([
            fila.cells[0].textContent.trim(),
            fila.cells[1].textContent.trim(),
            fila.cells[2].textContent.trim(),
            fila.cells[3].textContent.trim(),
            fila.cells[4].textContent.trim()
        ]);
    });
    return filas;
}

const ENCABEZADOS_USUARIOS = ["Nombre", "Correo", "Documento", "Cargo", "Estado"];

document.getElementById("btn-exportar").addEventListener("click", function () {
    exportarCSV("usuarios", ENCABEZADOS_USUARIOS, filasVisiblesComoCSV());
});

document.getElementById("btn-imprimir").addEventListener("click", function () {
    window.print();
});

document.getElementById("btn-reporte").addEventListener("click", function () {
    exportarCSV("reporte_usuarios", ENCABEZADOS_USUARIOS, filasVisiblesComoCSV());
});

document.getElementById("tabla-usuarios").addEventListener("click", function (e) {
    const fila = e.target.closest("tr[data-id]");
    if (!fila) return;
    const id = fila.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        const nombre = fila.cells[0].textContent.trim();
        confirmarEliminar(
            '¿Estás seguro de que deseas eliminar al usuario "' + nombre + '"?',
            async function () {
                try {
                    await apiFetch("/usuario/" + id, { method: "DELETE" });
                    fila.remove();
                } catch (error) {
                    alert("No se pudo eliminar el usuario:\n" + error.message);
                }
            }
        );
        return;
    }

    if (e.target.classList.contains("editar")) {
        abrirModalEditarUsuario(id);
    }
});

const modalOverlay     = document.getElementById("modal-editar-usuario-overlay");
const formEditar       = document.getElementById("form-editar-usuario");
const editNombre       = document.getElementById("edit-us-nombre");
const editApellido     = document.getElementById("edit-us-apellido");
const editCorreo       = document.getElementById("edit-us-correo");
const editCargo        = document.getElementById("edit-us-cargo");
const editTipoDoc      = document.getElementById("edit-us-tipo-doc");
const editDocumento    = document.getElementById("edit-us-documento");
const editEstado       = document.getElementById("edit-us-estado");
const editPass         = document.getElementById("edit-us-pass");
const btnCancelarEditar = document.getElementById("btn-cancelar-editar-usuario");

let idUsuarioActual = null;

function abrirModalEditarUsuario(id) {
    const usuario = ultimosUsuarios.find(function (u) { return String(u.id) === String(id); });
    if (!usuario) return;

    idUsuarioActual = usuario.id;
    editNombre.value    = usuario.nombre;
    editApellido.value  = usuario.apellido;
    editCorreo.value    = usuario.correo;
    editCargo.value     = usuario.cargo;
    editTipoDoc.value   = usuario.tipo_documento;
    editDocumento.value = usuario.documento;
    editEstado.value    = usuario.activo === false ? "false" : "true";
    editPass.value      = "";
    modalOverlay.classList.remove("oculto");
}

function cerrarModalEditarUsuario() {
    modalOverlay.classList.add("oculto");
    idUsuarioActual = null;
}

btnCancelarEditar.addEventListener("click", cerrarModalEditarUsuario);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) cerrarModalEditarUsuario();
});

formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!idUsuarioActual) return;

    const datos = {
        nombre: editNombre.value.trim(),
        apellido: editApellido.value.trim(),
        correo: editCorreo.value.trim(),
        cargo: editCargo.value,
        tipo_documento: editTipoDoc.value,
        documento: editDocumento.value.trim(),
        activo: editEstado.value === "true"
    };
    if (editPass.value) {
        datos.contraseña = editPass.value;
    }

    const btnGuardar = formEditar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;

    try {
        const actualizado = await apiFetch("/usuario/" + idUsuarioActual, {
            method: "PUT",
            body: JSON.stringify(datos)
        });
        const idx = ultimosUsuarios.findIndex(function (u) { return u.id === actualizado.id; });
        if (idx >= 0) ultimosUsuarios[idx] = actualizado;

        document.querySelector('#tabla-usuarios tr[data-id="' + actualizado.id + '"]')
            .replaceWith(crearFilaUsuario(actualizado));
        filtrarUsuarios();
        cerrarModalEditarUsuario();
    } catch (error) {
        alert("No se pudo actualizar el usuario:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
    }
});

const modalAgregarOverlay = document.getElementById("modal-agregar-usuario-overlay");
const formAgregarUsuario  = document.getElementById("form-agregar-usuario");
const addNombreUs   = document.getElementById("add-us-nombre");
const addApellidoUs = document.getElementById("add-us-apellido");
const addCorreoUs   = document.getElementById("add-us-correo");
const addCargoUs    = document.getElementById("add-us-cargo");
const addTipoDocUs  = document.getElementById("add-us-tipo-doc");
const addDocumentoUs = document.getElementById("add-us-documento");
const addEstadoUs   = document.getElementById("add-us-estado");
const addPassUs     = document.getElementById("add-us-pass");
const addPass2Us    = document.getElementById("add-us-pass2");
const reEmail       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function abrirModalAgregarUsuario() {
    formAgregarUsuario.reset();
    modalAgregarOverlay.classList.remove("oculto");
}

function cerrarModalAgregarUsuario() {
    modalAgregarOverlay.classList.add("oculto");
}

document.getElementById("btn-abrir-agregar-usuario").addEventListener("click", abrirModalAgregarUsuario);
document.getElementById("btn-cancelar-agregar-usuario").addEventListener("click", cerrarModalAgregarUsuario);
modalAgregarOverlay.addEventListener("click", function (e) {
    if (e.target === modalAgregarOverlay) cerrarModalAgregarUsuario();
});

formAgregarUsuario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = addCorreoUs.value.trim();
    const pass   = addPassUs.value;
    const pass2  = addPass2Us.value;

    if (!reEmail.test(correo)) return;
    if (pass !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const datos = {
        nombre: addNombreUs.value.trim(),
        apellido: addApellidoUs.value.trim(),
        correo: correo,
        cargo: addCargoUs.value,
        tipo_documento: addTipoDocUs.value,
        documento: addDocumentoUs.value.trim(),
        activo: addEstadoUs.value === "true",
        contraseña: pass
    };

    const btnGuardar = formAgregarUsuario.querySelector(".modal-guardar");
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {
        const creado = await apiFetch("/usuario", {
            method: "POST",
            body: JSON.stringify(datos)
        });
        ultimosUsuarios.push(creado);

        const tbody = document.getElementById("tabla-usuarios");
        const placeholder = tbody.querySelector("td[colspan]");
        if (placeholder) placeholder.closest("tr").remove();
        tbody.appendChild(crearFilaUsuario(creado));
        filtrarUsuarios();

        cerrarModalAgregarUsuario();
    } catch (error) {
        alert("No se pudo crear el usuario:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Crear Usuario";
    }
});

cargarUsuarios();
