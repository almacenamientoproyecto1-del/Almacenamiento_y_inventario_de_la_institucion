import { ESTADOS_IMPLEMENTO } from "../../scripts/constants.js";
import { nombrePorId } from "../../scripts/lookup.js";

function escapar(valor) {
    return String(valor === null || valor === undefined ? "" : valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function formatearFecha(valor) {
    return new Date(valor).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function abrirReporte(titulo, columnas, filas) {
    const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

    const encabezadoHtml = columnas.map(function (c) { return "<th>" + c + "</th>"; }).join("");
    const filasHtml = filas.map(function (fila) {
        return "<tr>" + fila.map(function (celda) { return "<td>" + escapar(celda) + "</td>"; }).join("") + "</tr>";
    }).join("");

    const html =
        "<!doctype html><html lang='es'><head><meta charset='UTF-8'>" +
        "<base href='" + window.location.href + "'>" +
        "<title>" + titulo + " - I.E.M.M</title>" +
        "<link rel='stylesheet' href='style6.css'>" +
        "<style>" +
        "  main.reporte { padding: 20px 35px; }" +
        "  main.reporte h1 { color: #222; margin-bottom: 5px; }" +
        "  main.reporte p.subtitulo { color: gray; margin-bottom: 20px; }" +
        "  table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.1); }" +
        "  th, td { padding: 10px 12px; text-align: left; font-size: 13px; border-bottom: 1px solid #ddd; }" +
        "  th { background: #1d2d85; color: white; }" +
        "  tbody tr:nth-child(even) { background: #f7f7fa; }" +
        "  thead { display: table-header-group; }" +
        "  tr { page-break-inside: avoid; }" +
        "  #btn-imprimir-reporte { width: auto; background: #0b1f63; color: white; border: none; padding: 10px 12px; border-radius: 6px; font-size: 14px; font-family: inherit; cursor: pointer; }" +
        "  #btn-imprimir-reporte:hover { background: #0a1a52; }" +
        "  @media print {" +
        "    nav, #btn-imprimir-reporte { display: none !important; }" +
        "  }" +
        "</style>" +
        "</head><body>" +
        "<header>" +
        "  <div class='logo-contenedor'>" +
        "    <img src='../../img/ESCUDO.png' alt='' class='logo'>" +
        "    <div class='texto-logo'><h2>Maria Montessori</h2><p>Gestión Almacenamiento</p></div>" +
        "  </div>" +
        "  <nav>" +
        "    <a href='../panel_principal/index1.html'>Panel Principal</a>" +
        "    <a href='../Inventario/index2.html'>Inventario</a>" +
        "    <a href='../Ubicaciones/index3.html'>Ubicaciones</a>" +
        "    <a href='../Categorias/index4.html'>Categorías</a>" +
        "    <a href='../Usuarios/index5.html'>Usuarios</a>" +
        "    <a href='../Informe/index6.html' class='activo'>Informes y Análisis</a>" +
        "  </nav>" +
        "  <button type='button' class='admin' id='btn-imprimir-reporte' onclick='window.print()'>Imprimir</button>" +
        "</header>" +
        "<main class='reporte'>" +
        "<h1>" + titulo + " - I.E.M.M</h1>" +
        "<p class='subtitulo'>Generado el " + fecha + " &middot; " + filas.length + " registros</p>" +
        "<table><thead><tr>" + encabezadoHtml + "</tr></thead><tbody>" +
        (filasHtml || "<tr><td colspan='" + columnas.length + "'>No hay registros.</td></tr>") +
        "</tbody></table>" +
        "</main>" +
        "</body></html>";

    const ventana = window.open("", "_blank");
    if (!ventana) {
        alert("El navegador bloqueó la ventana emergente. Permite las ventanas emergentes para este sitio y vuelve a intentarlo.");
        return;
    }
    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    setTimeout(function () { ventana.print(); }, 250);
}

export function abrirReporteHistorialImprimible(implementos, categorias, ubicaciones, proveedores) {
    const filas = implementos.map(function (i) {
        return [
            i.codigo,
            i.nombre,
            nombrePorId(categorias, i.id_categoria),
            formatearFecha(i.fecha_adquisicion),
            nombrePorId(proveedores, i.id_proveedor),
            nombrePorId(ubicaciones, i.id_ubicacion)
        ];
    });
    abrirReporte("Reporte de Historial", ["Código", "Material", "Categoría", "Fecha Adq.", "Proveedor", "Ubicación"], filas);
}

export function abrirReporteMovimientosImprimible(movimientos) {
    const filas = movimientos.map(function (m) {
        return [
            formatearFecha(m.fecha),
            ESTADOS_IMPLEMENTO[m.estado] || m.estado,
            m.nombre_material + " (" + m.codigo_material + ")",
            m.cantidad,
            m.nombre_usuario
        ];
    });
    abrirReporte("Reporte de Movimientos", ["Fecha", "Estado", "Material", "Cantidad", "Usuario"], filas);
}
