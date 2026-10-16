import {crearProveedor,
leerProveedor,
actualizarProveedor,
eliminarProveedor} from '../repository/proveedor.repository.js'

export const servicioCrearProveedor = (proveedorData) => {
    return crearProveedor(proveedorData);
}
export const servicioLeerProveedor = () => {
    return leerProveedor();
}
export const servicioActualizarProveedor = (proveedorId, proveedorData) => {
    return actualizarProveedor(proveedorId, proveedorData);
}
export const servicioEliminarProveedor = (proveedorId) => {
    return eliminarProveedor(proveedorId);
}
