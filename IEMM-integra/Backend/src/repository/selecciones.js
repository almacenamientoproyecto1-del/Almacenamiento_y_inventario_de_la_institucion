export const usuarioPublico = {
  id: true, nombre: true, apellido: true, correo: true, cargo: true,
  tipo_documento: true, documento: true, activo: true
};
export const relacionesImplemento = {
  proveedor: true, ubicacion: true, categoria: true,
  usuario: { select: usuarioPublico }, responsables: true
};
