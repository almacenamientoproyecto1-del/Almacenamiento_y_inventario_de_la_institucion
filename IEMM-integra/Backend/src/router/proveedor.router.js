import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import { actualizarProveedor,
     createProveedor,
      eliminarProveedor, 
      leerProveedor } from "../controller/proveedor.controller.js";

const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("proveedor"), createProveedor);
router.get("/", leerProveedor);
router.put("/:id", validarCuerpo("proveedor"), actualizarProveedor);
router.delete("/:id", eliminarProveedor);

export default router;