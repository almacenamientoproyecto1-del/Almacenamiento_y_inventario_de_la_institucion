// Responsabilidad única: construir y abrir la ventana imprimible del
// reporte de stock. No sabe cómo se cargan los datos (eso es de informe.js).
import { ESTADOS_IMPLEMENTO } from "../../scripts/constants.js";
import { nombrePorId } from "../../scripts/lookup.js";

function generarFilasReporteStock(implementos, categorias, ubicaciones, proveedores) {
    return implementos.map(function (i) {
        return {
            codigo: i.codigo,
            nombre: i.nombre,
            categoria: nombrePorId(categorias, i.id_categoria),
            cantidad: i.cantidad,
            estado: ESTADOS_IMPLEMENTO[i.estado] || i.estado,
            ubicacion: nombrePorId(ubicaciones, i.id_ubicacion),
            proveedor: nombrePorId(proveedores, i.id_proveedor)
        };
    });
}

export function abrirReporteStockImprimible(implementos, categorias, ubicaciones, proveedores) {
    const filas = generarFilasReporteStock(implementos, categorias, ubicaciones, proveedores);
    const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

    const filasHtml = filas.map(function (f) {
        return "<tr>" +
            "<td>" + f.codigo + "</td>" +
            "<td>" + f.nombre + "</td>" +
            "<td>" + f.categoria + "</td>" +
            "<td>" + f.cantidad + "</td>" +
            "<td>" + f.estado + "</td>" +
            "<td>" + f.ubicacion + "</td>" +
            "<td>" + f.proveedor + "</td>" +
            "</tr>";
    }).join("");

    const html =
        "<!doctype html><html lang='es'><head><meta charset='UTF-8'>" +
        "<base href='" + window.location.href + "'>" +
        "<title>Reporte de Stock - I.E.M.M</title>" +
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
        "<h1>Reporte de Stock - I.E.M.M</h1>" +
        "<p class='subtitulo'>Generado el " + fecha + " &middot; " + filas.length + " materiales</p>" +
        "<table><thead><tr>" +
        "<th>Código</th><th>Material</th><th>Categoría</th><th>Cantidad</th><th>Estado</th><th>Ubicación</th><th>Proveedor</th>" +
        "</tr></thead><tbody>" +
        (filasHtml || "<tr><td colspan='7'>No hay materiales registrados.</td></tr>") +
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
