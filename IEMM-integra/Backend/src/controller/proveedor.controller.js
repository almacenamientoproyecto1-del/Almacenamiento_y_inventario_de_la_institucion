import {
    servicioCrearProveedor,
    servicioLeerProveedor,
    servicioActualizarProveedor,
    servicioEliminarProveedor
} from "../service/proveedor.service.js";
import { manejarError } from "../utils/manejarError.js";

export const createProveedor= async (req, res)=>{
    try{
        const proveedor = await servicioCrearProveedor(req.body);
        res.status(201).json(proveedor);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerProveedor= async (req, res)=>{
     try{
      const proveedor = await servicioLeerProveedor();
        res.status(200).json(proveedor);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarProveedor= async (req, res)=>{
    try{
        const Id=Number(req.params.id)
        const proveedor=await servicioActualizarProveedor(Id,req.body);
        res.status(200).json(proveedor);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarProveedor=async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarProveedor(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
