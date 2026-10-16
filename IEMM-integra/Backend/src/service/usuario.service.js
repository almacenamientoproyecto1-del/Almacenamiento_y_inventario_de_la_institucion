import bcrypt from 'bcryptjs'
import {crearUsuario,
  leerUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../repository/usuario.repository.js'

const RONDAS_SAL = 10;

/** Quita el hash de la contraseña antes de exponer un usuario en una respuesta HTTP. */
export const omitirContrasena = (usuario) => {
    if (!usuario) return usuario;
    const { contraseña, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
}

export const servicioCrearUsuario = async (userData) => {
    const datos = { ...userData };
    if (datos.contraseña) {
        datos.contraseña = await bcrypt.hash(datos.contraseña, RONDAS_SAL);
    }
    const usuario = await crearUsuario(datos);
    return omitirContrasena(usuario);
}
export const servicioLeerUsuario = async () => {
    const usuarios = await leerUsuario();
    return usuarios.map(omitirContrasena);
}
export const servicioActualizarUsuario = async (userId, userData) => {
    const datos = { ...userData };
    if (datos.contraseña) {
        datos.contraseña = await bcrypt.hash(datos.contraseña, RONDAS_SAL);
    }
    const usuario = await actualizarUsuario(userId, datos);
    return omitirContrasena(usuario);
}
export const servicioEliminarUsuario = (userId) => {
    return eliminarUsuario(userId);
}
