import { actualizarCategoria,
     crearCategoria,
      eliminarCategoria,
       leerCategoria } from "../repository/categoria.repository.js";


export const servicioCrearCategoria = (categoriaData) => {
    return crearCategoria(categoriaData);
}
export const servicioLeerCategoria = () => {
    return leerCategoria();
}
export const servicioActualizarCategoria = (categoriaId, categoriaData) => {
    return actualizarCategoria(categoriaId, categoriaData);
}
export const servicioEliminarCategoria = (categoriaId) => {
    return eliminarCategoria(categoriaId);
}