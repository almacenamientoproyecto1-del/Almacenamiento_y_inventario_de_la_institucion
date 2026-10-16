import {crearImplemento,
  leerImplemento,
  actualizarImplemento,
  eliminarImplemento
} from '../repository/implemento.repository.js'

export const servicioCrearImplemento = (implementoData, usuarioId) => {
    return crearImplemento(implementoData, usuarioId);
}
export const servicioLeerImplemento = () => {
    return leerImplemento();
}
export const servicioActualizarImplemento = (implementoId, implementoData, usuarioId) => {
    return actualizarImplemento(implementoId, implementoData, usuarioId);
}
export const servicioEliminarImplemento = (implementoId) => {
    return eliminarImplemento(implementoId);
}
