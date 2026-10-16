import  prisma from "../prisma.js"

export const crearResponsable=(responsableData)=>{
    return prisma.responsable.create({data:responsableData})  

}
export const leerResponsable=()=>{
    return prisma.responsable.findMany({ include: { implemento: true }, orderBy: { id: "asc" } })
}
export const actualizarResponsable=(responsableId, responsableData)=>{
    return prisma.responsable.update({
        where: { id: responsableId },
        data: responsableData
    })
}
export const eliminarResponsable=(responsableId)=>{
    return prisma.responsable.delete({
        where: { id: responsableId }
    })
}