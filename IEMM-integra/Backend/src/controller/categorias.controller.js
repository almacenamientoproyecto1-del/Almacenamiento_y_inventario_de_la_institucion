import {
    servicioCrearCategoria,
    servicioLeerCategoria,
    servicioActualizarCategoria,
    servicioEliminarCategoria
} from "../service/categoria.service.js";
import { manejarError } from "../utils/manejarError.js";

export const crearCategoria = async (req, res)=>{
    try{
        const categorias = await servicioCrearCategoria(req.body);
        res.status(201).json(categorias);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerCategorias = async (req, res)=>{
     try{
      const categorias = await servicioLeerCategoria();
        res.status(200).json(categorias);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarCategoria = async (req, res)=>{
    try{
        const Id=Number(req.params.id)
        const categorias=await servicioActualizarCategoria(Id,req.body);
        res.status(200).json(categorias);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarCategoria = async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarCategoria(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
