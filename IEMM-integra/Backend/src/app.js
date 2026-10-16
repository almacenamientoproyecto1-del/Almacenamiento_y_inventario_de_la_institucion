import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./router/auth.router.js"
import usuario from "./router/usuario.router.js"
import ubicacion from "./router/ubicacion.router.js"
import responsable from "./router/responsable.router.js"
import proveedor from "./router/proveedor.router.js"
import implemento from "./router/implemento.router.js"
import categoria from "./router/categoria.router.js"
import movimiento from "./router/movimiento.router.js"
import { protegerRuta } from "./middleware/auth.middleware.js";

const app = express();

const origins = (process.env.CORS_ORIGINS || "http://localhost:5500").split(",").map(origin => origin.trim()).filter(Boolean);
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API I.E.M.M - Inventario de implementos funcionando correctamente.");
});

// Autenticación: /auth/login y /auth/registrar son públicas, /auth/me exige sesión (ver auth.router.js).
app.use("/auth", auth);

// A partir de aquí, todas las rutas requieren un JWT válido (login previo).
app.use("/usuario", protegerRuta, usuario);
app.use("/ubicacion", protegerRuta, ubicacion);
app.use("/responsable", protegerRuta, responsable);
app.use("/proveedor", protegerRuta, proveedor);
app.use("/implemento", protegerRuta, implemento);
app.use("/categoria", protegerRuta, categoria);
app.use("/movimiento", protegerRuta, movimiento);


app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});


app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido." });
  }
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor." });
});

export default app;
