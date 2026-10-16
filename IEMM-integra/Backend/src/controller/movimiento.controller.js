import { servicioLeerMovimientos } from "../service/movimiento.service.js";
import { manejarError } from "../utils/manejarError.js";

export const leerMovimientos = async (req, res) => {
    try {
        const limite = Number(req.query.limite);
        if (req.query.limite !== undefined && (!Number.isInteger(limite) || limite < 1 || limite > 1000)) {
            return res.status(400).json({ error: "limite debe ser un entero entre 1 y 1000." });
        }
        const movimientos = await servicioLeerMovimientos(Number.isInteger(limite) && limite > 0 ? limite : undefined);
        res.status(200).json(movimientos);
    } catch (error) {
        manejarError(res, error, 500);
    }
};
