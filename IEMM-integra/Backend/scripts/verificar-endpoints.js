import 'dotenv/config';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import prisma from '../src/prisma.js';
import { generarToken } from '../src/utils/jwt.js';

const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
let comprobaciones = 0;
async function comprobar(method, ruta, status, token, body) {
  const response = await fetch(base + ruta, { method, headers: { ...(token ? {Authorization:'Bearer ' + token} : {}), ...(body !== undefined ? {'Content-Type':'application/json'} : {}) }, ...(body !== undefined ? {body:JSON.stringify(body)} : {}) });
  assert.equal(response.status, status, method + ' ' + ruta);
  const text = await response.text();
  const data = response.headers.get('content-type')?.includes('application/json') && text ? JSON.parse(text) : text;
  assert.ok(!/"contraseña"\s*:/.test(text), 'No debe exponer contraseñas');
  comprobaciones++;
  return data;
}
try {
  const usuario = await prisma.usuario.findFirst({where:{activo:true}});
  assert.ok(usuario, 'Se requiere un usuario activo para probar lecturas autenticadas.');
  const token = generarToken({id:usuario.id, correo:usuario.correo, cargo:usuario.cargo});
  await comprobar('GET','/',200);
  await comprobar('GET','/auth/me',401);
  const me = await comprobar('GET','/auth/me',200,token);
  assert.equal(me.id,usuario.id);
  await comprobar('POST','/auth/login',400,undefined,{});
  await comprobar('POST','/auth/login',401,undefined,{correo:'prueba-inexistente@example.invalid',contraseña:'incorrecta'});
  await comprobar('POST','/auth/registrar',400,undefined,{});
  await comprobar('POST','/auth/signout',200);
  for(const recurso of ['usuario','ubicacion','categoria','proveedor','implemento','responsable','movimiento']) {
    await comprobar('GET','/' + recurso,401);
    const datos = await comprobar('GET','/' + recurso,200,token);
    assert.ok(Array.isArray(datos));
    const filas = await prisma[recurso].findMany();
    assert.equal(datos.length, filas.length);
    for (const fila of filas) {
      const recibido = datos.find(item => item.id === fila.id);
      assert.ok(recibido, 'Falta registro ' + fila.id);
      const { contraseña, ...publico } = fila;
      for (const [campo, valor] of Object.entries(JSON.parse(JSON.stringify(publico)))) {
        assert.deepEqual(recibido[campo], valor, recurso + '.' + campo);
      }
    }
    if(recurso === 'implemento') for(const item of datos) {
      assert.equal(item.ubicacion.id,item.id_ubicacion);
      assert.equal(item.categoria.id,item.id_categoria);
      assert.equal(item.usuario.id,item.id_usuarios);
      if(item.id_proveedor !== null) assert.equal(item.proveedor.id,item.id_proveedor);
    }
    if(recurso === 'responsable') for(const item of datos) assert.equal(item.implemento.id,item.id_implemento);
    console.log('GET /' + recurso + ': 200, ' + datos.length + ' registros coinciden con PostgreSQL.');
    if(recurso !== 'movimiento') {
      await comprobar('POST','/' + recurso,400,token,{});
      await comprobar('PUT','/' + recurso + '/abc',400,token,{});
      await comprobar('PUT','/' + recurso + '/1',400,token,{id:1});
      await comprobar('DELETE','/' + recurso + '/0',400,token);
    }
  }
  const recientes = await comprobar('GET','/movimiento?limite=1',200,token);
  assert.ok(recientes.length <= 1);
  await comprobar('GET','/movimiento?limite=-1',400,token);
  await comprobar('GET','/no-existe',404);
  console.log(comprobaciones + ' comprobaciones HTTP aprobadas. Las pruebas no crean, actualizan ni eliminan registros.');
} finally {
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
}
