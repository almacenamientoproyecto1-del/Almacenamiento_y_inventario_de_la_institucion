import { apiFetch } from "../../scripts/api.js";
import "../../scripts/loader.js";
import "../../scripts/logout.js";
import { ESTADOS_IMPLEMENTO } from "../../scripts/constants.js";

async function cargarPanel() {
    const listaStock = document.getElementById("lista-stock-bajo");
    try {
        const [implementos, categorias] = await Promise.all([
            apiFetch("/implemento"),
            apiFetch("/categoria")
        ]);

        const contarPorEstado = function (estado) {
            return implementos.filter(function (i) { return i.estado === estado; }).length;
        };

        document.getElementById("stat-total").textContent       = implementos.length;
        document.getElementById("stat-disponibles").textContent = contarPorEstado("DISPONIBLE");
        document.getElementById("stat-agotados").textContent    = contarPorEstado("AGOTADO");
        document.getElementById("stat-danados").textContent     = contarPorEstado("DANADO");
        document.getElementById("stat-stock-bajo").textContent  = contarPorEstado("STOCK_BAJO");
        document.getElementById("stat-categorias").textContent  = categorias.length;

        const enStockBajo = implementos.filter(function (i) { return i.estado === "STOCK_BAJO"; });
        if (!enStockBajo.length) {
            listaStock.innerHTML = "<p>No hay materiales en stock bajo.</p>";
        } else {
            listaStock.innerHTML = "";
            enStockBajo.forEach(function (i) {
                const p = document.createElement("p");
                p.textContent = i.nombre + " (" + i.codigo + ") — cantidad: " + i.cantidad;
                listaStock.appendChild(p);
            });
        }
    } catch (error) {
        listaStock.innerHTML = "<p>No se pudo conectar con la API: " + error.message + "</p>";
    }
}

const CLASE_ESTADO = {
    DISPONIBLE: "disponible",
    AGOTADO: "agotado",
    DANADO: "danado",
    STOCK_BAJO: "stock"
};

function formatearFecha(valor) {
    return new Date(valor).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

async function cargarMovimientos() {
    const tbody = document.getElementById("tbody-movimientos");
    try {
        const movimientos = await apiFetch("/movimiento?limite=5");

        if (!movimientos.length) {
            tbody.innerHTML = "<tr><td colspan='5'>Todavía no hay movimientos registrados.</td></tr>";
            return;
        }

        tbody.innerHTML = "";
        movimientos.forEach(function (m) {
            const tr = document.createElement("tr");

            const celdas = [
                formatearFecha(m.fecha),
                m.nombre_material + " " + m.codigo_material,
                null,
                m.cantidad,
                m.nombre_usuario
            ];

            celdas.forEach(function (valor, indice) {
                const td = document.createElement("td");
                if (indice === 2) {
                    const span = document.createElement("span");
                    span.className = CLASE_ESTADO[m.estado] || "disponible";
                    span.textContent = ESTADOS_IMPLEMENTO[m.estado] || m.estado;
                    td.appendChild(span);
                } else {
                    td.textContent = valor;
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='5'>No se pudo conectar con la API: " + error.message + "</td></tr>";
    }
}

cargarPanel();
cargarMovimientos();
