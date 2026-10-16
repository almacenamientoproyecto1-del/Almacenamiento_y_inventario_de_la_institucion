import { apiFetch } from "../../scripts/api.js";
import { confirmarEliminar } from "../../scripts/confirm-modal.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";

const modalAgregarOverlay = document.getElementById("modal-agregar-ubicacion-overlay");
const formAgregar    = document.getElementById("form-agregar-ubicacion");
const addCodigo      = document.getElementById("add-u-codigo");
const addNombre      = document.getElementById("add-u-nombre");
const addDescripcion = document.getElementById("add-u-descripcion");
const addResponsable = document.getElementById("add-u-responsable");
const addCapacidad   = document.getElementById("add-u-capacidad");

function abrirModalAgregarUbicacion() {
    formAgregar.reset();
    modalAgregarOverlay.classList.remove("oculto");
}

function cerrarModalAgregarUbicacion() {
    modalAgregarOverlay.classList.add("oculto");
}

document.getElementById("btn-abrir-agregar-ubicacion").addEventListener("click", abrirModalAgregarUbicacion);
document.getElementById("btn-cancelar-agregar-ubicacion").addEventListener("click", cerrarModalAgregarUbicacion);
modalAgregarOverlay.addEventListener("click", function (e) {
    if (e.target === modalAgregarOverlay) cerrarModalAgregarUbicacion();
});

formAgregar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre      = addNombre.value.trim();
    const codigo      = addCodigo.value.trim();
    const descripcion = addDescripcion.value.trim();
    const responsable = addResponsable.value;
    const capacidad   = addCapacidad.value.trim();

    if (!nombre || !codigo || !descripcion) return;

    const btnGuardar = formAgregar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {
        const ubicacionCreada = await apiFetch("/ubicacion", {
            method: "POST",
            body: JSON.stringify({
                nombre: nombre,
                codigo: codigo,
                descripcion: descripcion,
                responsable: responsable,
                capacidad: capacidad ? Number(capacidad) : null
            })
        });

        const contenedor = document.getElementById("contenedor-tarjetas");
        contenedor.querySelectorAll("p").forEach(function (p) { p.remove(); });
        contenedor.appendChild(crearTarjetaUbicacion(ubicacionCreada));

        cerrarModalAgregarUbicacion();
    } catch (error) {
        alert("No se pudo guardar la ubicación en el servidor:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar Ubicación";
    }
});

const buscador = document.getElementById("buscar");

buscador.addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
        const nombre      = tarjeta.querySelector("h3").textContent.toLowerCase();
        const descripcion = tarjeta.querySelector("p").textContent.toLowerCase();
        const categoria   = tarjeta.dataset.categoria.toLowerCase();
        tarjeta.style.display =
            (nombre.includes(texto) || descripcion.includes(texto) || categoria.includes(texto))
            ? "block" : "none";
    });
});

document.getElementById("contenedor-tarjetas").addEventListener("click", function (e) {

    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta || !tarjeta.dataset.id) return;
    const id = tarjeta.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        const nombre = tarjeta.querySelector("h3").textContent.trim();
        confirmarEliminar(
            '¿Estás seguro de que deseas eliminar la ubicación "' + nombre + '"?',
            async function () {
                try {
                    await apiFetch("/ubicacion/" + id, { method: "DELETE" });
                    tarjeta.remove();
                } catch (error) {
                    alert("No se pudo eliminar la ubicación:\n" + error.message);
                }
            }
        );
        return;
    }

    if (e.target.classList.contains("ver")) {
        abrirModalVerDetalles(tarjeta);
        return;
    }

    if (e.target.classList.contains("editar")) {
        abrirModalEditarUbicacion(tarjeta);
        return;
    }
});

const modalVerOverlay   = document.getElementById("modal-ver-ubicacion-overlay");
const btnCerrarVer      = document.getElementById("btn-cerrar-ver-ubicacion");
const verNombre         = document.getElementById("ver-u-nombre");
const verDescripcion    = document.getElementById("ver-u-descripcion");
const verCategoria      = document.getElementById("ver-u-categoria");
const verMateriales     = document.getElementById("ver-u-materiales");
const verCategorias     = document.getElementById("ver-u-categorias");

async function abrirModalVerDetalles(tarjeta) {
    verNombre.textContent      = tarjeta.querySelector("h3").textContent.trim();
    verDescripcion.textContent = tarjeta.querySelector("p").textContent.trim();
    verCategoria.textContent   = tarjeta.dataset.categoria;
    verMateriales.textContent  = "Cargando...";
    verCategorias.textContent  = "Cargando...";
    modalVerOverlay.classList.remove("oculto");

    try {
        const implementos = await apiFetch("/implemento");
        const deEstaUbicacion = implementos.filter(function (i) {
            return i.id_ubicacion === Number(tarjeta.dataset.id);
        });
        const categoriasUnicas = new Set(deEstaUbicacion.map(function (i) { return i.id_categoria; }));
        verMateriales.textContent = String(deEstaUbicacion.length);
        verCategorias.textContent = String(categoriasUnicas.size);
    } catch (error) {
        verMateriales.textContent = "-";
        verCategorias.textContent = "-";
    }
}

function cerrarModalVerDetalles() {
    modalVerOverlay.classList.add("oculto");
}

btnCerrarVer.addEventListener("click", cerrarModalVerDetalles);
modalVerOverlay.addEventListener("click", function (e) {
    if (e.target === modalVerOverlay) cerrarModalVerDetalles();
});

const modalOverlay    = document.getElementById("modal-editar-ubicacion-overlay");
const formEditar      = document.getElementById("form-editar-ubicacion");
const inputCodigo     = document.getElementById("edit-u-codigo");
const inputNombre     = document.getElementById("edit-u-nombre");
const inputDescripcion = document.getElementById("edit-u-descripcion");
const inputResponsable = document.getElementById("edit-u-responsable");
const inputCapacidad  = document.getElementById("edit-u-capacidad");
const btnCancelar     = document.getElementById("btn-cancelar-editar-ubicacion");

let tarjetaActual = null;

function abrirModalEditarUbicacion(tarjeta) {
    tarjetaActual = tarjeta;

    inputCodigo.value      = tarjeta.dataset.codigo || ("UB-" + tarjeta.dataset.id);
    inputNombre.value      = tarjeta.querySelector("h3").textContent.trim();
    inputDescripcion.value = tarjeta.querySelector("p").textContent.trim();
    inputResponsable.value = tarjeta.dataset.responsable || "";
    inputCapacidad.value   = tarjeta.dataset.capacidad || "";
    modalOverlay.classList.remove("oculto");
}

function cerrarModalEditarUbicacion() {
    modalOverlay.classList.add("oculto");
    tarjetaActual = null;
}

btnCancelar.addEventListener("click", cerrarModalEditarUbicacion);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) cerrarModalEditarUbicacion();
});

formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!tarjetaActual) return;

    const nuevoNombre      = inputNombre.value.trim();
    const nuevaDescripcion = inputDescripcion.value.trim();
    const id                = tarjetaActual.dataset.id;

    if (!nuevoNombre) { inputNombre.focus(); return; }
    if (!nuevaDescripcion) { inputDescripcion.focus(); return; }

    const btnGuardar = formEditar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;

    const nuevoResponsable = inputResponsable.value.trim();
    const nuevaCapacidad   = inputCapacidad.value.trim();

    try {
        await apiFetch("/ubicacion/" + id, {
            method: "PUT",
            body: JSON.stringify({
                nombre: nuevoNombre,
                descripcion: nuevaDescripcion,
                responsable: nuevoResponsable,
                capacidad: nuevaCapacidad ? Number(nuevaCapacidad) : null
            })
        });

        tarjetaActual.querySelector("h3").textContent = nuevoNombre;
        tarjetaActual.querySelector("p").textContent  = nuevaDescripcion;
        tarjetaActual.dataset.responsable = nuevoResponsable;
        tarjetaActual.dataset.capacidad   = nuevaCapacidad;
        tarjetaActual.dataset.categoria   = nuevoNombre.toLowerCase().replace(/\s+/g, "-");

        cerrarModalEditarUbicacion();
    } catch (error) {
        alert("No se pudo actualizar la ubicación:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
    }
});

function crearTarjetaUbicacion(ubicacion) {
    const descripcion   = ubicacion.descripcion || "-";
    const categoriaSlug = ubicacion.nombre.toLowerCase().replace(/\s+/g, "-");

    const div = document.createElement("div");
    div.className = "tarjeta";
    div.dataset.id          = ubicacion.id;
    div.dataset.codigo      = ubicacion.codigo || "";
    div.dataset.responsable = ubicacion.responsable || "";
    div.dataset.capacidad   = ubicacion.capacidad != null ? ubicacion.capacidad : "";
    div.dataset.categoria   = categoriaSlug;
    div.innerHTML =
        "<h3>" + ubicacion.nombre + "</h3>" +
        "<p>" + descripcion + "</p>" +
        "<div class='datos'><p>Materiales: -</p><p>Categorías: -</p></div>" +
        "<div class='botones'>" +
            "<button class='editar'>Editar</button>" +
            "<button class='eliminar'>X</button>" +
            "<button class='ver'>Ver detalles</button>" +
        "</div>";
    return div;
}

async function cargarUbicaciones() {
    const contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.innerHTML = "<p>Cargando ubicaciones...</p>";
    try {
        const ubicaciones = await apiFetch("/ubicacion");
        contenedor.innerHTML = "";

        if (!ubicaciones.length) {
            contenedor.innerHTML = "<p>Todavía no hay ubicaciones registradas.</p>";
            return;
        }

        ubicaciones.forEach(function (ubicacion) {
            contenedor.appendChild(crearTarjetaUbicacion(ubicacion));
        });
    } catch (error) {
        contenedor.innerHTML = "<p>No se pudo conectar con la API: " + error.message + "</p>";
    }
}

cargarUbicaciones();
