import  prisma  from "../prisma.js"

export const crearUbicacion=(ubicacionData)=>{
    return prisma.ubicacion.create({data:ubicacionData})  

}
export const leerUbicacion=()=>{
    return prisma.ubicacion.findMany({ orderBy: { id: "asc" } })
}
export const actualizarUbicacion=(ubicacionId, ubicacionData)=>{
    return prisma.ubicacion.update({
        where: { id: ubicacionId },
        data: ubicacionData
    })
}
export const eliminarUbicacion=(ubicacionId)=>{
    return prisma.ubicacion.delete({
        where: { id: ubicacionId }
    })  
}