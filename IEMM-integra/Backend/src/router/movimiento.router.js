import { Router } from "express";
import { leerMovimientos } from "../controller/movimiento.controller.js";

const router = Router();
router.get("/", leerMovimientos);

export default router;
