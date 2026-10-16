import { leerMovimientos } from "../repository/movimiento.repository.js"

export const servicioLeerMovimientos = (limite) => {
    return leerMovimientos(limite);
}
