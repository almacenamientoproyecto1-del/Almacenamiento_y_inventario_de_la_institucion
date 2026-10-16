import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import { actualizarUbicacion, 
    createUbicacion, 
    eliminarUbicacion,
    leerUbicacion } from "../controller/ubicacion.controller.js";

const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("ubicacion"), createUbicacion);
router.get("/", leerUbicacion);
router.put("/:id", validarCuerpo("ubicacion"), actualizarUbicacion);
router.delete("/:id", eliminarUbicacion);

export default router;