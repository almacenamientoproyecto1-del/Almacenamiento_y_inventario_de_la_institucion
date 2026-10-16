import { apiFetch } from "../../scripts/api.js";
import { confirmarEliminar } from "../../scripts/confirm-modal.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";

const modalAgregarOverlay = document.getElementById("modal-agregar-categoria-overlay");
const formAgregar         = document.getElementById("form-agregar-categoria");
const addCodigo           = document.getElementById("add-cat-codigo");
const addNombre           = document.getElementById("add-cat-nombre");
const addDescripcion      = document.getElementById("add-cat-descripcion");

function abrirModalAgregarCategoria() {
    formAgregar.reset();
    modalAgregarOverlay.classList.remove("oculto");
}

function cerrarModalAgregarCategoria() {
    modalAgregarOverlay.classList.add("oculto");
}

document.getElementById("btn-abrir-agregar-categoria").addEventListener("click", abrirModalAgregarCategoria);
document.getElementById("btn-cancelar-agregar-categoria").addEventListener("click", cerrarModalAgregarCategoria);
modalAgregarOverlay.addEventListener("click", function (e) {
    if (e.target === modalAgregarOverlay) cerrarModalAgregarCategoria();
});

formAgregar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre      = addNombre.value.trim();
    const codigo      = addCodigo.value.trim();
    const descripcion = addDescripcion.value.trim();

    if (!nombre || !codigo || !descripcion) return;

    const btnGuardar = formAgregar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {
        const categoriaCreada = await apiFetch("/categoria", {
            method: "POST",
            body: JSON.stringify({ nombre: nombre, codigo: codigo, descripcion: descripcion })
        });

        const tbody = document.getElementById("tbody-categorias");
        const placeholder = tbody.querySelector("td[colspan]");
        if (placeholder) placeholder.closest("tr").remove();
        tbody.appendChild(crearFilaCategoria(categoriaCreada));

        cerrarModalAgregarCategoria();
    } catch (error) {
        alert("No se pudo guardar la categoría en el servidor:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar Categoría";
    }
});

const buscador = document.getElementById("buscar");

buscador.addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    document.querySelectorAll("#tbody-categorias tr").forEach(function (fila) {
        if (!fila.dataset.id) return;
        const nombre = fila.cells[1].textContent.toLowerCase();
        const descripcion = fila.cells[2].textContent.toLowerCase();
        fila.style.display =
            (nombre.includes(texto) || descripcion.includes(texto)) ? "" : "none";
    });
});

document.getElementById("tbody-categorias").addEventListener("click", function (e) {

    const fila = e.target.closest("tr");
    if (!fila || !fila.dataset.id) return;
    const id = fila.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        const nombre = fila.cells[1].textContent.trim();
        confirmarEliminar(
            '¿Estás seguro de que deseas eliminar la categoría "' + nombre + '"?',
            async function () {
                try {
                    await apiFetch("/categoria/" + id, { method: "DELETE" });
                    fila.remove();
                } catch (error) {
                    alert("No se pudo eliminar la categoría:\n" + error.message);
                }
            }
        );
        return;
    }

    if (e.target.classList.contains("editar")) {
        abrirModalEditarCategoria(fila);
        return;
    }
});

const modalOverlay     = document.getElementById("modal-editar-categoria-overlay");
const formEditar       = document.getElementById("form-editar-categoria");
const inputCodigo      = document.getElementById("edit-cat-codigo");
const inputNombre      = document.getElementById("edit-cat-nombre");
const inputDescripcion = document.getElementById("edit-cat-descripcion");
const btnCancelar      = document.getElementById("btn-cancelar-editar-categoria");

let filaActual = null;

function abrirModalEditarCategoria(fila) {
    filaActual = fila;

    inputCodigo.value      = fila.cells[0].textContent.trim();
    inputNombre.value      = fila.cells[1].textContent.trim();
    inputDescripcion.value = fila.cells[2].textContent.trim();
    modalOverlay.classList.remove("oculto");
}

function cerrarModalEditarCategoria() {
    modalOverlay.classList.add("oculto");
    filaActual = null;
}

btnCancelar.addEventListener("click", cerrarModalEditarCategoria);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) cerrarModalEditarCategoria();
});

formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!filaActual) return;

    const nuevoNombre      = inputNombre.value.trim();
    const nuevaDescripcion = inputDescripcion.value.trim();
    const id                = filaActual.dataset.id;

    if (!nuevoNombre) { inputNombre.focus(); return; }
    if (!nuevaDescripcion) { inputDescripcion.focus(); return; }

    const btnGuardar = formEditar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;

    try {
        await apiFetch("/categoria/" + id, {
            method: "PUT",
            body: JSON.stringify({ nombre: nuevoNombre, descripcion: nuevaDescripcion })
        });

        filaActual.cells[1].textContent = nuevoNombre;
        filaActual.cells[2].textContent = nuevaDescripcion;

        cerrarModalEditarCategoria();
    } catch (error) {
        alert("No se pudo actualizar la categoría:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
    }
});

function crearFilaCategoria(categoria) {
    const codigo      = categoria.codigo || ("CAT-" + categoria.id);
    const descripcion = categoria.descripcion || "-";

    const tr = document.createElement("tr");
    tr.dataset.id = categoria.id;
    tr.innerHTML =
        "<td>" + codigo + "</td>" +
        "<td>" + categoria.nombre + "</td>" +
        "<td>" + descripcion + "</td>" +
        "<td>" + (categoria._count && categoria._count.materiales != null ? categoria._count.materiales : "-") + "</td>" +
        "<td><button class='editar'>Editar</button><button class='eliminar'>X</button></td>";
    return tr;
}

async function cargarCategorias() {
    const tbody = document.getElementById("tbody-categorias");
    tbody.innerHTML = "<tr><td colspan='5'>Cargando categorías...</td></tr>";
    try {
        const categorias = await apiFetch("/categoria");
        tbody.innerHTML = "";

        if (!categorias.length) {
            tbody.innerHTML = "<tr><td colspan='5'>Todavía no hay categorías registradas.</td></tr>";
            return;
        }

        categorias.forEach(function (categoria) {
            tbody.appendChild(crearFilaCategoria(categoria));
        });
    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='5'>No se pudo conectar con la API: " + error.message + "</td></tr>";
    }
}

cargarCategorias();
