// Busca el "nombre" de un elemento por id dentro de un arreglo (típicamente
// una lista de categorías/ubicaciones/proveedores ya cargada desde la API).
export function nombrePorId(lista, id) {
    const item = lista.find(function (i) { return i.id === id; });
    return item ? item.nombre : "-";
}
