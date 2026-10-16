import { apiFetch } from "../../scripts/api.js";
import { poblarSelect } from "../../scripts/dom.js";
import { ESTADOS_IMPLEMENTO } from "../../scripts/constants.js";
import { obtenerUsuarioActual } from "../../scripts/session.js";
import { confirmarEliminar } from "../../scripts/confirm-modal.js";
import { nombrePorId } from "../../scripts/lookup.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";

let categoriasCache  = [];
let ubicacionesCache = [];
let proveedoresCache = [];
let ultimosImplementos = [];

const ESTADO_CLASE = {
    DISPONIBLE: "disponible",
    AGOTADO: "agotado",
    DANADO: "danado",
    STOCK_BAJO: "stock"
};

function crearFilaImplemento(implemento) {
    const tr = document.createElement("tr");
    tr.dataset.id         = implemento.id;
    tr.dataset.categoria  = implemento.id_categoria;
    tr.dataset.ubicacion  = implemento.id_ubicacion;
    tr.dataset.estado     = implemento.estado;

    const claseEstado = ESTADO_CLASE[implemento.estado] || "disponible";
    const etiquetaEstado = ESTADOS_IMPLEMENTO[implemento.estado] || implemento.estado;

    tr.innerHTML =
        "<td>" + implemento.codigo + "</td>" +
        "<td>" + implemento.nombre + "</td>" +
        "<td>" + nombrePorId(categoriasCache, implemento.id_categoria) + "</td>" +
        "<td>" + implemento.cantidad + "</td>" +
        "<td><span class='" + claseEstado + "'>" + etiquetaEstado + "</span></td>" +
        "<td>" + nombrePorId(ubicacionesCache, implemento.id_ubicacion) + "</td>" +
        "<td>" + nombrePorId(proveedoresCache, implemento.id_proveedor) + "</td>" +
        "<td><button class='editar'>Editar</button><button class='eliminar'>X</button></td>";
    return tr;
}

async function cargarInventario() {
    const tbody = document.getElementById("tabla-materiales");
    tbody.innerHTML = "<tr><td colspan='8'>Cargando materiales...</td></tr>";
    try {
        const [implementos, categorias, ubicaciones, proveedores] = await Promise.all([
            apiFetch("/implemento"),
            apiFetch("/categoria"),
            apiFetch("/ubicacion"),
            apiFetch("/proveedor")
        ]);

        categoriasCache  = categorias;
        ubicacionesCache = ubicaciones;
        proveedoresCache = proveedores;
        ultimosImplementos = implementos;

        poblarSelect(document.getElementById("filtro-categoria"), categorias, "id", "nombre", "Todas las categorías");
        poblarSelect(document.getElementById("filtro-ubicacion"), ubicaciones, "id", "nombre", "Todas las ubicaciones");
        poblarSelect(document.getElementById("add-mat-categoria"), categorias, "id", "nombre", "Seleccionar categoría...");
        poblarSelect(document.getElementById("add-mat-ubicacion"), ubicaciones, "id", "nombre", "Seleccionar ubicación...");
        poblarSelect(document.getElementById("edit-categoria"), categorias, "id", "nombre");
        poblarSelect(document.getElementById("edit-ubicacion"), ubicaciones, "id", "nombre");
        poblarSelect(document.getElementById("edit-proveedor"), proveedores, "id", "nombre", "Sin proveedor");

        tbody.innerHTML = "";
        if (!implementos.length) {
            tbody.innerHTML = "<tr><td colspan='8'>Todavía no hay materiales registrados.</td></tr>";
            return;
        }
        implementos.forEach(function (implemento) {
            tbody.appendChild(crearFilaImplemento(implemento));
        });
        filtrarTabla();
    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='8'>No se pudo conectar con la API: " + error.message + "</td></tr>";
    }
}

(function () {
    const params = new URLSearchParams(window.location.search);
    const filtroUrl = params.get("filtro");
    if (filtroUrl === "stock") {
        document.getElementById("filtro-estado").value = "STOCK_BAJO";
    }
})();

const buscador        = document.getElementById("buscar");
const selectCategoria = document.getElementById("filtro-categoria");
const selectEstado    = document.getElementById("filtro-estado");
const selectUbicacion = document.getElementById("filtro-ubicacion");

function filtrarTabla() {
    const texto     = buscador.value.toLowerCase();
    const categoria = selectCategoria.value;
    const estado    = selectEstado.value;
    const ubicacion = selectUbicacion.value;

    document.querySelectorAll("#tabla-materiales tr[data-id]").forEach(function (fila) {
        const txtCodigo = fila.cells[0].textContent.toLowerCase();
        const txtNombre = fila.cells[1].textContent.toLowerCase();

        const coincideTexto     = !texto || txtCodigo.includes(texto) || txtNombre.includes(texto);
        const coincideCategoria = !categoria || fila.dataset.categoria === categoria;
        const coincideEstado    = !estado || fila.dataset.estado === estado;
        const coincideUbicacion = !ubicacion || fila.dataset.ubicacion === ubicacion;

        fila.style.display =
            (coincideTexto && coincideCategoria && coincideEstado && coincideUbicacion)
            ? "" : "none";
    });
}

buscador.addEventListener("keyup", filtrarTabla);
selectCategoria.addEventListener("change", filtrarTabla);
selectEstado.addEventListener("change", filtrarTabla);
selectUbicacion.addEventListener("change", filtrarTabla);

document.getElementById("tabla-materiales").addEventListener("click", function (e) {
    const fila = e.target.closest("tr[data-id]");
    if (!fila) return;
    const id = fila.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        const nombre = fila.cells[1].textContent.trim();
        confirmarEliminar(
            '¿Estás seguro de que deseas eliminar "' + nombre + '"?',
            async function () {
                try {
                    await apiFetch("/implemento/" + id, { method: "DELETE" });
                    fila.remove();
                } catch (error) {
                    alert("No se pudo eliminar el material:\n" + error.message);
                }
            }
        );
        return;
    }

    if (e.target.classList.contains("editar")) {
        abrirModalEditar(fila);
    }
});

const modalOverlay   = document.getElementById("modal-editar-overlay");
const formEditar     = document.getElementById("form-editar-material");
const inputCodigo    = document.getElementById("edit-codigo");
const inputNombre    = document.getElementById("edit-nombre");
const inputCategoria = document.getElementById("edit-categoria");
const inputCantidad  = document.getElementById("edit-cantidad");
const inputEstado    = document.getElementById("edit-estado");
const inputUbicacion = document.getElementById("edit-ubicacion");
const inputProveedor = document.getElementById("edit-proveedor");
const btnCancelar    = document.getElementById("btn-cancelar-editar");

let filaActual = null;

function abrirModalEditar(fila) {
    filaActual = fila;
    inputCodigo.value    = fila.cells[0].textContent.trim();
    inputNombre.value    = fila.cells[1].textContent.trim();
    inputCategoria.value = fila.dataset.categoria;
    inputCantidad.value  = fila.cells[3].textContent.trim();
    inputEstado.value    = fila.dataset.estado;
    inputUbicacion.value = fila.dataset.ubicacion;

    const implemento = ultimosImplementos.find(function (i) { return String(i.id) === fila.dataset.id; });
    inputProveedor.value = (implemento && implemento.id_proveedor != null) ? implemento.id_proveedor : "";

    modalOverlay.classList.remove("oculto");
}

function cerrarModalEditar() {
    modalOverlay.classList.add("oculto");
    filaActual = null;
}

btnCancelar.addEventListener("click", cerrarModalEditar);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) cerrarModalEditar();
});

formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!filaActual) return;

    const id = filaActual.dataset.id;
    const datos = {
        nombre: inputNombre.value.trim(),
        cantidad: Number(inputCantidad.value),
        estado: inputEstado.value,
        id_categoria: Number(inputCategoria.value),
        id_ubicacion: Number(inputUbicacion.value),
        id_proveedor: inputProveedor.value ? Number(inputProveedor.value) : null
    };

    const btnGuardar = formEditar.querySelector(".modal-guardar");
    btnGuardar.disabled = true;

    try {
        const actualizado = await apiFetch("/implemento/" + id, {
            method: "PUT",
            body: JSON.stringify(datos)
        });
        const idx = ultimosImplementos.findIndex(function (i) { return i.id === Number(id); });
        if (idx >= 0) ultimosImplementos[idx] = actualizado;

        filaActual.replaceWith(crearFilaImplemento(actualizado));
        filtrarTabla();
        cerrarModalEditar();
    } catch (error) {
        alert("No se pudo actualizar el material:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
    }
});

const modalAgregarOverlay = document.getElementById("modal-agregar-material-overlay");
const formAgregarMaterial = document.getElementById("form-agregar-material");
const addCodigo    = document.getElementById("add-mat-codigo");
const addNombre    = document.getElementById("add-mat-nombre");
const addCategoria = document.getElementById("add-mat-categoria");
const addUbicacion = document.getElementById("add-mat-ubicacion");
const addCantidad  = document.getElementById("add-mat-cantidad");
const addEstado    = document.getElementById("add-mat-estado");

function abrirModalAgregarMaterial() {
    formAgregarMaterial.reset();
    modalAgregarOverlay.classList.remove("oculto");
}

function cerrarModalAgregarMaterial() {
    modalAgregarOverlay.classList.add("oculto");
}

document.getElementById("btn-abrir-agregar-material").addEventListener("click", abrirModalAgregarMaterial);
document.getElementById("btn-cancelar-agregar-material").addEventListener("click", cerrarModalAgregarMaterial);
modalAgregarOverlay.addEventListener("click", function (e) {
    if (e.target === modalAgregarOverlay) cerrarModalAgregarMaterial();
});

formAgregarMaterial.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = await obtenerUsuarioActual();

    const datos = {
        codigo: addCodigo.value.trim(),
        nombre: addNombre.value.trim(),
        cantidad: Number(addCantidad.value),
        estado: addEstado.value,
        id_categoria: Number(addCategoria.value),
        id_ubicacion: Number(addUbicacion.value),
        id_usuarios: usuario.id
    };

    const btnGuardar = formAgregarMaterial.querySelector(".modal-guardar");
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {
        const creado = await apiFetch("/implemento", {
            method: "POST",
            body: JSON.stringify(datos)
        });
        ultimosImplementos.push(creado);

        const tbody = document.getElementById("tabla-materiales");
        const placeholder = tbody.querySelector("td[colspan]");
        if (placeholder) placeholder.closest("tr").remove();
        tbody.appendChild(crearFilaImplemento(creado));
        filtrarTabla();

        cerrarModalAgregarMaterial();
    } catch (error) {
        alert("No se pudo guardar el material en el servidor:\n" + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar Material";
    }
});

cargarInventario();
