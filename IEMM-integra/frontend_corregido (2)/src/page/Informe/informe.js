// Responsabilidad única: cargar los datos reales y renderizar las tarjetas
// y la tabla de resumen. La construcción del reporte imprimible vive en
// reporte-stock.js.
import { apiFetch } from "../../scripts/api.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";
import { abrirReporteStockImprimible } from "./reporte-stock.js";
import { abrirReporteHistorialImprimible, abrirReporteMovimientosImprimible } from "./reportes-adicionales.js";

let implementosCache = [];
let categoriasCache  = [];
let ubicacionesCache = [];
let proveedoresCache = [];
let movimientosCache = [];

function contarPorEstado(lista, estado) {
    return lista.filter(function (i) { return i.estado === estado; }).length;
}

async function cargarInforme() {
    const tbody = document.getElementById("tbody-resumen-categoria");
    try {
        const [implementos, categorias, ubicaciones, proveedores] = await Promise.all([
            apiFetch("/implemento"),
            apiFetch("/categoria"),
            apiFetch("/ubicacion"),
            apiFetch("/proveedor")
        ]);
        implementosCache = implementos;
        categoriasCache  = categorias;
        ubicacionesCache = ubicaciones;
        proveedoresCache = proveedores;

        document.getElementById("inf-total").textContent       = implementos.length + " artículos";
        document.getElementById("inf-disponibles").textContent = contarPorEstado(implementos, "DISPONIBLE") + " disponibles";
        document.getElementById("inf-agotados").textContent    = contarPorEstado(implementos, "AGOTADO") + " agotados";
        document.getElementById("inf-danados").textContent     = contarPorEstado(implementos, "DANADO") + " dañados";

        if (!categorias.length) {
            tbody.innerHTML = "<tr><td colspan='6'>Todavía no hay categorías registradas.</td></tr>";
            return;
        }

        tbody.innerHTML = "";
        categorias.forEach(function (categoria) {
            const deEstaCategoria = implementos.filter(function (i) { return i.id_categoria === categoria.id; });
            const total       = deEstaCategoria.length;
            const disponibles = contarPorEstado(deEstaCategoria, "DISPONIBLE");
            const agotados    = contarPorEstado(deEstaCategoria, "AGOTADO");
            const danados     = contarPorEstado(deEstaCategoria, "DANADO");
            const porcentaje  = total ? ((disponibles / total) * 100).toFixed(1) : "0.0";

            const tr = document.createElement("tr");
            tr.innerHTML =
                "<td>" + categoria.nombre + "</td>" +
                "<td>" + total + "</td>" +
                "<td>" + disponibles + "</td>" +
                "<td>" + agotados + "</td>" +
                "<td>" + danados + "</td>" +
                "<td>" + porcentaje + "%</td>";
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='6'>No se pudo conectar con la API: " + error.message + "</td></tr>";
    }
}

document.getElementById("btn-exportar-stock").addEventListener("click", function () {
    abrirReporteStockImprimible(implementosCache, categoriasCache, ubicacionesCache, proveedoresCache);
});

document.getElementById("btn-exportar-historial").addEventListener("click", function () {
    abrirReporteHistorialImprimible(implementosCache, categoriasCache, ubicacionesCache, proveedoresCache);
});

document.getElementById("btn-exportar-movimientos").addEventListener("click", function () {
    abrirReporteMovimientosImprimible(movimientosCache);
});

async function cargarMovimientos() {
    try {
        movimientosCache = await apiFetch("/movimiento");
    } catch (error) {
        movimientosCache = [];
    }
}

cargarInforme();
cargarMovimientos();
