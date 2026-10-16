const cargo = ['SECRETARIA', 'COORDINADOR', 'RECTOR', 'DOCENTE'];
const documento = ['CC', 'CE', 'PPT'];
// [tipo, obligatorio al crear, longitud máxima o valores permitidos, admite null]
const schemas = {
  categoria: {nombre:['string',true,50], codigo:['string',false,30,true], descripcion:['string',false,255,true]},
  ubicacion: {nombre:['string',true,50], codigo:['string',false,30,true], descripcion:['string',false,255,true], capacidad:['nonnegative',false,null,true], responsable:['string',false,100,true]},
  proveedor: {nombre:['string',true,100], correo:['string',true,100], telefono:['string',true,20]},
  usuario: {nombre:['string',true,50], apellido:['string',true,50], correo:['string',true,100], cargo:['enum',true,cargo], contraseña:['string',true,255], tipo_documento:['enum',true,documento], documento:['string',true,20], activo:['boolean',false]},
  responsable: {nombre:['string',true,50], apellido:['string',true,50], correo:['string',true,100], cargo:['enum',true,cargo], tipo_documento:['enum',true,documento], documento:['string',true,20], asignatura:['string',true,50], id_implemento:['positive',true]},
  implemento: {nombre:['string',true,50], codigo:['string',true,30], cantidad:['nonnegative',false], estado:['enum',true,['DISPONIBLE','AGOTADO','DANADO','STOCK_BAJO']], id_proveedor:['positive',false,null,true], id_ubicacion:['positive',true], id_categoria:['positive',true], id_usuarios:['positive',true], fecha_adquisicion:['date',false]},
  login: {correo:['string',true,100], contraseña:['string',true,255]}
};
export function validarDatos(tipo, datos, parcial = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'El cuerpo debe ser un objeto JSON.';
  const schema = schemas[tipo];
  if (Object.keys(datos).some(campo => !Object.hasOwn(schema, campo))) return 'El cuerpo contiene campos no permitidos.';
  if (parcial && !Object.keys(datos).length) return 'Indica al menos un campo para actualizar.';
  for (const [campo, [tipoCampo, requerido, limite, nullable]] of Object.entries(schema)) {
    const valor = datos[campo];
    if (valor === undefined) { if (requerido && !parcial) return 'Falta el campo ' + campo + '.'; continue; }
    if (valor === null && nullable) continue;
    const valido = tipoCampo === 'string' ? typeof valor === 'string' && valor.trim().length > 0 && valor.length <= limite
      : tipoCampo === 'enum' ? limite.includes(valor)
      : tipoCampo === 'boolean' ? typeof valor === 'boolean'
      : tipoCampo === 'date' ? typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor) && Number.isFinite(Date.parse(valor))
      : Number.isInteger(valor) && valor <= 2147483647 && valor >= (tipoCampo === 'positive' ? 1 : 0);
    if (!valido) return 'Valor inválido para ' + campo + '.';
  }
  return null;
}
export function validarCuerpo(tipo) {
  return (req, res, next) => {
    const error = validarDatos(tipo, req.body, req.method === 'PUT');
    if (error) return res.status(400).json({error});
    next();
  };
}
export function validarId(req, res, next, id) {
  if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) return res.status(400).json({error:'El id debe ser un entero positivo válido.'});
  next();
}
