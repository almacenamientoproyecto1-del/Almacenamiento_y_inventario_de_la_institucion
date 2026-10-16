import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import { actualizarResponsable,
     createResponsable, 
     eliminarResponsable, 
     leerResponsable } from "../controller/responsable.controller.js";

const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("responsable"), createResponsable);
router.get("/", leerResponsable);
router.put("/:id", validarCuerpo("responsable"), actualizarResponsable);
router.delete("/:id", eliminarResponsable);

export default router;