import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma.js";

async function main() {
  const correo = process.env.SEED_ADMIN_CORREO || "admin@iemm.edu.co";
  const contraseñaPlano = process.env.SEED_ADMIN_CONTRASENA || "CambiaEstaClave123";
  const documento = process.env.SEED_ADMIN_DOCUMENTO || "0000000000";

  const contraseña = await bcrypt.hash(contraseñaPlano, 10);

  const usuario = await prisma.usuario.upsert({
    where: { correo },
    update: { contraseña },
    create: {
      nombre: "Admin",
      apellido: "Sistema",
      correo,
      cargo: "RECTOR",
      contraseña,
      tipo_documento: "CC",
      documento,
    },
  });

  console.log("Usuario administrador listo:");
  console.log(`  correo:      ${usuario.correo}`);
  console.log(`  contraseña:  ${contraseñaPlano}  (cámbiala después de iniciar sesión)`);
}

main()
  .catch((error) => {
    console.error("Error al crear el usuario administrador:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
