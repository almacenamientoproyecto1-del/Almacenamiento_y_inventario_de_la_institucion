import {
  crearUbicacion,
  leerUbicacion,
  actualizarUbicacion,
  eliminarUbicacion} from '../repository/ubicacion.repository.js'

export const servicioCrearUbicacion = (ubicacionData) => {
    return crearUbicacion(ubicacionData);
}
export const servicioLeerUbicacion = () => {
    return leerUbicacion();
}
export const servicioActualizarUbicacion = (ubicacionId, ubicacionData) => {
    return actualizarUbicacion(ubicacionId, ubicacionData);
}
export const servicioEliminarUbicacion = (ubicacionId) => {
    return eliminarUbicacion(ubicacionId);
}

