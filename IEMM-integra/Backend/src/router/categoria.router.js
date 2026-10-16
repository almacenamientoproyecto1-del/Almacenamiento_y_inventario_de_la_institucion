import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import {
crearCategoria,
leerCategorias,
actualizarCategoria,
eliminarCategoria,
} from "../controller/categorias.controller.js";

const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("categoria"), crearCategoria);
router.get("/", leerCategorias);
router.put("/:id", validarCuerpo("categoria"), actualizarCategoria);
router.delete("/:id", eliminarCategoria);

export default router;