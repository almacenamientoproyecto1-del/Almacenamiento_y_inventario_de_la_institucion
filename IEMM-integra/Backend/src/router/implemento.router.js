import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import {
crearImplemento,
leerImplementos,
actualizarImplemento,
eliminarImplemento,
} from "../controller/implemento.controller.js";

const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("implemento"), crearImplemento);
router.get("/", leerImplementos);
router.put("/:id", validarCuerpo("implemento"), actualizarImplemento);
router.delete("/:id", eliminarImplemento);

export default router;