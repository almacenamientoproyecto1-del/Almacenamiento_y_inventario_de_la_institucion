import { validarCuerpo, validarId } from "../middleware/validacion.middleware.js";
import { Router } from "express";
import { actualizarUsuario, 
    createUsuario,
     eliminarUsuario, 
     leerUsuario } 
     from "../controller/usuario.controller.js";


const router = Router();
router.param("id", validarId);
router.post("/", validarCuerpo("usuario"), createUsuario);
router.get("/", leerUsuario);
router.put("/:id", validarCuerpo("usuario"), actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;