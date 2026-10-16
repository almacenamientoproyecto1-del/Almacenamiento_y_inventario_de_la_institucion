// Genera y descarga un archivo .csv a partir de encabezados + filas.
export function exportarCSV(nombreArchivo, encabezados, filas) {
    const BOM = "﻿";
    const lineas = [encabezados.join(",")];
    filas.forEach(function (fila) {
        const cols = fila.map(function (celda) {
            const t = String(celda).replace(/"/g, '""');
            return (t.indexOf(",") !== -1 || t.indexOf("\n") !== -1) ? '"' + t + '"' : t;
        });
        lineas.push(cols.join(","));
    });
    const blob = new Blob([BOM + lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = nombreArchivo + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
