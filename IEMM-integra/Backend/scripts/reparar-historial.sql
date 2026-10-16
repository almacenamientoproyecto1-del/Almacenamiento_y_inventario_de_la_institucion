-- Prisma espera id VARCHAR(36), no UUID. Conserva los identificadores y registros.
ALTER TABLE "_prisma_migrations" ALTER COLUMN "id" TYPE VARCHAR(36) USING "id"::text;
