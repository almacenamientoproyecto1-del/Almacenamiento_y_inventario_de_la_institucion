-- Completa los campos antes de que la migración de movimientos consulte cantidad.
ALTER TYPE "Estado" ADD VALUE IF NOT EXISTS 'DANADO';
ALTER TYPE "Estado" ADD VALUE IF NOT EXISTS 'STOCK_BAJO';
ALTER TABLE "Implemento" ADD COLUMN IF NOT EXISTS "cantidad" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Implemento" ALTER COLUMN "id_proveedor" DROP NOT NULL;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "activo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Ubicacion" ADD COLUMN IF NOT EXISTS "codigo" VARCHAR(30), ADD COLUMN IF NOT EXISTS "descripcion" VARCHAR(255), ADD COLUMN IF NOT EXISTS "capacidad" INTEGER, ADD COLUMN IF NOT EXISTS "responsable" VARCHAR(100);
ALTER TABLE "Categoria" ADD COLUMN IF NOT EXISTS "codigo" VARCHAR(30), ADD COLUMN IF NOT EXISTS "descripcion" VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS "Ubicacion_codigo_key" ON "Ubicacion"("codigo");
CREATE UNIQUE INDEX IF NOT EXISTS "Categoria_codigo_key" ON "Categoria"("codigo");
