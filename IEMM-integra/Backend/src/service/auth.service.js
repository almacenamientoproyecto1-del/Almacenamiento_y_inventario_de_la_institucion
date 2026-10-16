import bcrypt from 'bcryptjs'
import { buscarUsuarioPorCorreo, buscarUsuarioPorId } from '../repository/usuario.repository.js'
import { omitirContrasena, servicioCrearUsuario } from './usuario.service.js'
import { generarToken } from '../utils/jwt.js'

/** Error de credenciales inválidas; el controlador lo traduce a HTTP 401. */
export class CredencialesInvalidasError extends Error {
    constructor() {
        super('Correo o contraseña incorrectos.');
        this.name = 'CredencialesInvalidasError';
    }
}

/** Error de correo ya registrado; el controlador lo traduce a HTTP 409. */
export class CorreoEnUsoError extends Error {
    constructor() {
        super('Ya existe un usuario registrado con ese correo.');
        this.name = 'CorreoEnUsoError';
    }
}

export const servicioRegistrar = async (userData) => {
    const { correo, contraseña } = userData ?? {};
    if (!correo || !contraseña) {
        const error = new Error('Debes indicar correo y contraseña.');
        error.status = 400;
        throw error;
    }

    const existente = await buscarUsuarioPorCorreo(correo);
    if (existente) {
        throw new CorreoEnUsoError();
    }

    const usuario = await servicioCrearUsuario(userData);

    const token = generarToken({
        id: usuario.id,
        correo: usuario.correo,
        cargo: usuario.cargo,
    });

    return { token, usuario };
}

export const servicioLogin = async (correo, contraseña) => {
    if (!correo || !contraseña) {
        const error = new Error('Debes indicar correo y contraseña.');
        error.status = 400;
        throw error;
    }

    const usuario = await buscarUsuarioPorCorreo(correo);
    if (!usuario || !usuario.activo) {
        throw new CredencialesInvalidasError();
    }

    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) {
        throw new CredencialesInvalidasError();
    }

    const token = generarToken({
        id: usuario.id,
        correo: usuario.correo,
        cargo: usuario.cargo,
    });

    return { token, usuario: omitirContrasena(usuario) };
}

export const servicioMe = async (userId) => {
    const usuario = await buscarUsuarioPorId(userId);
    if (!usuario) {
        const error = new Error('El usuario autenticado ya no existe.');
        error.status = 404;
        throw error;
    }
    return omitirContrasena(usuario);
}
