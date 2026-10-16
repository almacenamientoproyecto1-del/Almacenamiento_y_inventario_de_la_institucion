import { Prisma } from "@prisma/client";

/**
 * Traduce errores de Prisma/Postgres a respuestas HTTP claras y en español,
 * en vez de exponer el error crudo de la base de datos.
 *
 * @param {import('express').Response} res
 * @param {unknown} error
 * @param {number} fallbackStatus - status a usar si el error no es reconocido
 */
export function manejarError(res, error, fallbackStatus = 500) {
  // Violación de restricción única (ej: correo o código duplicado)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const campos = error.meta?.target;
      const nombreCampo = Array.isArray(campos) ? campos.join(", ") : "el campo";
      return res.status(409).json({
        error: `Ya existe un registro con ese valor en ${nombreCampo}.`,
      });
    }

    // Registro no encontrado (update/delete sobre un id inexistente)
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "El registro solicitado no existe.",
      });
    }

    // Violación de llave foránea (ej: referencia a un id que no existe,
    // o intento de borrar un registro que aún tiene relaciones asociadas)
    if (error.code === "P2003") {
      const campo = error.meta?.field_name ?? "una referencia relacionada";
      return res.status(409).json({
        error: `Operación no permitida: ${campo} hace referencia a un registro que no existe o está en uso por otros registros.`,
      });
    }
  }

  if (["P1001", "P1002", "P1017", "P2024"].includes(error.code) || ["ECONNREFUSED", "ETIMEDOUT"].includes(error.code)) {
    return res.status(503).json({ error: "La base de datos no está disponible. Intenta nuevamente más tarde." });
  }

  // Datos con formato o tipos inválidos (ej: falta un campo requerido)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Datos inválidos: revisa que todos los campos requeridos estén presentes y con el tipo correcto.",
    });
  }

  // Cualquier otro error no reconocido: se registra en el servidor pero no se
  // expone su detalle interno (mensajes de driver, stack, rutas, etc.) al cliente.
  console.error(error);
  return res.status(fallbackStatus).json({
    error: "Error interno del servidor.",
  });
}
