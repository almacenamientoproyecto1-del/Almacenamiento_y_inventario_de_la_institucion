import { buscarUsuarioPorId } from "../repository/usuario.repository.js";
import { manejarError } from "../utils/manejarError.js";
import { verificarToken, NOMBRE_COOKIE_TOKEN } from "../utils/jwt.js";

/**
 * Extrae el token de la cookie httpOnly "token" o, si no está presente,
 * del header "Authorization: Bearer <token>".
 */
function extraerToken(req) {
  const tokenCookie = req.cookies?.[NOMBRE_COOKIE_TOKEN];
  if (tokenCookie) return tokenCookie;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return null;
}

/**
 * Middleware que protege una ruta: exige un JWT válido (login previo).
 * Si es válido, deja en `req.usuario` los datos del token (id, correo, cargo).
 */
export async function protegerRuta(req, res, next) {
  const token = extraerToken(req);

  if (!token) {
    return res.status(401).json({ error: "No autenticado: se requiere iniciar sesión." });
  }

  try {
    const payload = verificarToken(token);
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      return res.status(401).json({ error: "Sesión inválida." });
    }
    const usuario = await buscarUsuarioPorId(payload.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "El usuario ya no existe o está inactivo." });
    }
    req.usuario = { id: usuario.id, correo: usuario.correo, cargo: usuario.cargo };
    next();
  } catch (error) {
    if (!["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name)) return manejarError(res, error);
    return res.status(401).json({ error: "Sesión inválida o expirada. Inicia sesión nuevamente." });
  }
}

/**
 * Middleware que además exige que el usuario autenticado tenga uno de los
 * cargos indicados (control de acceso por rol).
 * Uso: router.delete("/:id", protegerRuta, permitirCargos("RECTOR", "COORDINADOR"), controlador)
 */
export function permitirCargos(...cargosPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "No autenticado: se requiere iniciar sesión." });
    }
    if (!cargosPermitidos.includes(req.usuario.cargo)) {
      return res.status(403).json({ error: "No tienes permisos para realizar esta acción." });
    }
    next();
  };
}
