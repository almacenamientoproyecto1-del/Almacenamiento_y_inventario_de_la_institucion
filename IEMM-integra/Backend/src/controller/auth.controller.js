import { servicioLogin, servicioRegistrar, servicioMe, CredencialesInvalidasError, CorreoEnUsoError } from "../service/auth.service.js";
import { manejarError } from "../utils/manejarError.js";
import { NOMBRE_COOKIE_TOKEN } from "../utils/jwt.js";

const OCHO_HORAS_MS = 8 * 60 * 60 * 1000;

const opcionesCookie = {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    //secure: process.env.NODE_ENV === "production",
    maxAge: OCHO_HORAS_MS,
};

export const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const { token, usuario } = await servicioLogin(correo, contraseña);

        // Se entrega el token tanto en una cookie httpOnly (uso desde navegador)
        // como en el cuerpo de la respuesta (uso desde apps/clientes no-navegador).
        res.cookie(NOMBRE_COOKIE_TOKEN, token, opcionesCookie);
        res.status(200).json({ token, usuario });
    } catch (error) {
        if (error instanceof CredencialesInvalidasError) {
            return res.status(401).json({ error: error.message });
        }
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        manejarError(res, error, 500);
    }
};

export const registrar = async (req, res) => {
    try {
        const { token, usuario } = await servicioRegistrar(req.body);

        res.cookie(NOMBRE_COOKIE_TOKEN, token, opcionesCookie);
        res.status(201).json({ token, usuario });
    } catch (error) {
        if (error instanceof CorreoEnUsoError) {
            return res.status(409).json({ error: error.message });
        }
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        manejarError(res, error, 500);
    }
};

export const me = async (req, res) => {
    try {
        const usuario = await servicioMe(req.usuario.id);
        res.status(200).json(usuario);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        manejarError(res, error, 500);
    }
};

export const signout = (req, res) => {
    const { maxAge, ...opcionesBorrado } = opcionesCookie;
    res.clearCookie(NOMBRE_COOKIE_TOKEN, opcionesBorrado);
    res.status(200).json({ mensaje: "Sesión cerrada correctamente." });
};
