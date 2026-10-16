import {
    servicioCrearUbicacion,
    servicioLeerUbicacion,
    servicioActualizarUbicacion,
    servicioEliminarUbicacion
} from "../service/ubicacion.service.js"
import { manejarError } from "../utils/manejarError.js";

export const createUbicacion= async (req, res)=>{
    try{
        const ubicacion = await servicioCrearUbicacion(req.body);
        res.status(201).json(ubicacion);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerUbicacion= async (req, res)=>{
     try{
      const ubicacion = await servicioLeerUbicacion();
        res.status(200).json(ubicacion);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarUbicacion= async (req, res)=>{
    try{
        const Id=Number(req.params.id)
        const ubicacion=await servicioActualizarUbicacion(Id,req.body);
        res.status(200).json(ubicacion);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarUbicacion=async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarUbicacion(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
