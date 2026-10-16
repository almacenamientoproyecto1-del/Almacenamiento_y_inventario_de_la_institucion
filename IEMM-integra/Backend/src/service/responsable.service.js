import {crearResponsable,
  leerResponsable,
  actualizarResponsable,
  eliminarResponsable
} from '../repository/responsable.repository.js'

export const servicioCrearResponsable = (responsableData) => {
    return crearResponsable(responsableData);
}
export const servicioLeerResponsable = () => {
    return leerResponsable();
}
export const servicioActualizarResponsable = (responsableId, responsableData) => {
    return actualizarResponsable(responsableId, responsableData);
}
export const servicioEliminarResponsable = (responsableId) => {
    return eliminarResponsable(responsableId);
}
