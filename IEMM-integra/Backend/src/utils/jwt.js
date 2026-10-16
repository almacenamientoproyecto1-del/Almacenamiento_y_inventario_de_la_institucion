import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

if (!JWT_SECRET) {
  throw new Error(
    "Falta la variable de entorno JWT_SECRET. Defínela en tu archivo .env (debe ser un valor largo y aleatorio)."
  );
}

/**
 * Genera un JWT firmado con los datos mínimos necesarios para identificar al usuario.
 * @param {{ id: number, correo: string, cargo: string }} payload
 */
export function generarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica un JWT y devuelve su payload decodificado.
 * Lanza si el token es inválido, está vencido o fue alterado.
 */
export function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export const NOMBRE_COOKIE_TOKEN = "token";
