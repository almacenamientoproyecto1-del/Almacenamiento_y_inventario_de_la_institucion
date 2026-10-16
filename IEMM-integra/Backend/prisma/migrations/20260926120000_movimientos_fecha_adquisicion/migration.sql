ALTER TABLE "Implemento" ADD COLUMN IF NOT EXISTS "fecha_adquisicion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "Movimiento" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo_material" VARCHAR(30) NOT NULL,
    "nombre_material" VARCHAR(50) NOT NULL,
    "estado" "Estado" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "nombre_usuario" VARCHAR(101) NOT NULL,
    "id_implemento" INTEGER,
    "id_usuarios" INTEGER,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Movimiento_id_implemento_fkey') THEN
        ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_id_implemento_fkey" FOREIGN KEY ("id_implemento") REFERENCES "Implemento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Movimiento_id_usuarios_fkey') THEN
        ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

INSERT INTO "Movimiento" ("fecha", "codigo_material", "nombre_material", "estado", "cantidad", "nombre_usuario", "id_implemento", "id_usuarios")
SELECT i."fecha_adquisicion", i."codigo", i."nombre", i."estado", i."cantidad", u."nombre" || ' ' || u."apellido", i."id", i."id_usuarios"
FROM "Implemento" i
JOIN "Usuario" u ON u."id" = i."id_usuarios"
WHERE NOT EXISTS (SELECT 1 FROM "Movimiento" m WHERE m."id_implemento" = i."id");
