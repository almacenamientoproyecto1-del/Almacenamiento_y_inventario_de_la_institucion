import prisma from "../prisma.js"

export const registrarMovimiento = async (cliente, implemento, usuarioId) => {
    const idUsuario = usuarioId ?? implemento.id_usuarios;
    const usuario = await cliente.usuario.findUnique({ where: { id: idUsuario } });
    const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellido}` : "Desconocido";

    return cliente.movimiento.create({
        data: {
            codigo_material: implemento.codigo,
            nombre_material: implemento.nombre,
            estado: implemento.estado,
            cantidad: implemento.cantidad,
            nombre_usuario: nombreUsuario,
            id_implemento: implemento.id,
            id_usuarios: usuario ? usuario.id : null
        }
    });
}

export const leerMovimientos = (limite) => {
    return prisma.movimiento.findMany({
        orderBy: [{ fecha: "desc" }, { id: "desc" }],
        ...(limite ? { take: limite } : {})
    });
}
