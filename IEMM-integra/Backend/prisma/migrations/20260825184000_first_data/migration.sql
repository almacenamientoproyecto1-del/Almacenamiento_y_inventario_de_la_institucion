-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('SECRETARIA', 'COORDINADOR', 'RECTOR', 'DOCENTE');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CC', 'CE', 'PPT');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('DISPONIBLE', 'AGOTADO');

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "cargo" "Cargo" NOT NULL,
    "contraseña" VARCHAR(255) NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL,
    "documento" VARCHAR(20) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Implemento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "estado" "Estado" NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_ubicacion" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_usuarios" INTEGER NOT NULL,

    CONSTRAINT "Implemento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsable" (
    "id" SERIAL NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL,
    "documento" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "cargo" "Cargo" NOT NULL,
    "asignatura" VARCHAR(50) NOT NULL,
    "id_implemento" INTEGER NOT NULL,

    CONSTRAINT "Responsable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_nombre_key" ON "Ubicacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_correo_key" ON "Proveedor"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "Usuario"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Implemento_codigo_key" ON "Implemento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_documento_key" ON "Responsable"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_correo_key" ON "Responsable"("correo");

-- AddForeignKey
ALTER TABLE "Implemento" ADD CONSTRAINT "Implemento_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implemento" ADD CONSTRAINT "Implemento_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "Ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implemento" ADD CONSTRAINT "Implemento_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implemento" ADD CONSTRAINT "Implemento_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsable" ADD CONSTRAINT "Responsable_id_implemento_fkey" FOREIGN KEY ("id_implemento") REFERENCES "Implemento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
