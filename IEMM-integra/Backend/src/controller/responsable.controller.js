import {
    servicioCrearResponsable,
    servicioLeerResponsable,
    servicioActualizarResponsable,
    servicioEliminarResponsable
} from "../service/responsable.service.js"
import { manejarError } from "../utils/manejarError.js";

export const createResponsable= async (req, res)=>{
    try{
        const responsable = await servicioCrearResponsable(req.body);
        res.status(201).json(responsable);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerResponsable= async (req, res)=>{
     try{
      const responsable = await servicioLeerResponsable();
        res.status(200).json(responsable);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarResponsable= async (req, res)=>{
    try{
        const Id=Number(req.params.id)
        const user=await servicioActualizarResponsable(Id,req.body);
        res.status(200).json(user);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarResponsable=async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarResponsable(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
