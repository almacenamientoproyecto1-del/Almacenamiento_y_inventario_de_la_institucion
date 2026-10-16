import prisma from "../prisma.js"

export const crearCategoria=(categoriaData)=>{
    return prisma.categoria.create({data:categoriaData})  

}
export const leerCategoria=()=>{
    return prisma.categoria.findMany({ orderBy: { id: "asc" } })
}
export const actualizarCategoria=(categoriaId, categoriaData)=>{
    return prisma.categoria.update({
        where: { id: categoriaId },
        data: categoriaData})
}
export const eliminarCategoria=(categoriaId)=>{
    return prisma.categoria.delete({
        where: { id: categoriaId }
    })
}
