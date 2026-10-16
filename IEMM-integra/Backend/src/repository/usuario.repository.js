import { usuarioPublico } from "./selecciones.js";
import  prisma  from "../prisma.js"

export const crearUsuario=(userData)=>{
    return prisma.usuario.create({data:userData})

}
export const leerUsuario=()=>{
    return prisma.usuario.findMany({ select: usuarioPublico, orderBy: { id: "asc" } })

}
export const actualizarUsuario=(userId, userData)=>{
    return prisma.usuario.update({
        where: { id: userId },
        data: userData
    })
}
export const eliminarUsuario=(userId)=>{
    return prisma.usuario.delete({
        where: { id: userId }
    })
}

// Usados por el módulo de autenticación (login / me).
export const buscarUsuarioPorCorreo=(correo)=>{
    return prisma.usuario.findUnique({
        where: { correo }
    })
}
export const buscarUsuarioPorId=(userId)=>{
    return prisma.usuario.findUnique({
        where: { id: userId }
    })
}