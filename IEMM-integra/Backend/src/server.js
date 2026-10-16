import "dotenv/config";
import app from "./app.js";
import prisma from "./prisma.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "Falta la variable de entorno DATABASE_URL. Crea un archivo .env basado en .env.example."
      );
    }

    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    const server = app.listen(PORT, () => {
      console.log(`Servidor listo en http://localhost:${PORT}`);
    });

    const apagarServidor = async () => {
      console.log("\nCerrando servidor...");
      server.close();
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on("SIGINT", apagarServidor);
    process.on("SIGTERM", apagarServidor);
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
