import { relacionesImplemento } from "./selecciones.js";
import  prisma  from "../prisma.js"
import { registrarMovimiento } from "./movimiento.repository.js"

export const crearImplemento=(implementoData, usuarioId)=>{
    return prisma.$transaction(async (tx)=>{
        const implemento = await tx.implemento.create({data:implementoData})
        await registrarMovimiento(tx, implemento, usuarioId)
        return implemento
    })
}
export const leerImplemento=()=>{
    return prisma.implemento.findMany({ include: relacionesImplemento, orderBy: { id: "asc" } })
}
export const actualizarImplemento=(implementoId, implementoData, usuarioId)=>{
    return prisma.$transaction(async (tx)=>{
        const anterior = await tx.implemento.findUnique({ where: { id: implementoId } })
        const actualizado = await tx.implemento.update({
            where: { id: implementoId },
            data: implementoData
        })
        if (anterior && (anterior.cantidad !== actualizado.cantidad || anterior.estado !== actualizado.estado)) {
            await registrarMovimiento(tx, actualizado, usuarioId)
        }
        return actualizado
    })
}
export const eliminarImplemento=(implementoId)=>{
    return prisma.implemento.delete({
        where: { id: implementoId }
    })
}