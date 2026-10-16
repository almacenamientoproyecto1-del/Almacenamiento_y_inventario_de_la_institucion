import {
    servicioCrearImplemento,
    servicioLeerImplemento,
    servicioActualizarImplemento,
    servicioEliminarImplemento
} from "../service/implemento.service.js"
import { manejarError } from "../utils/manejarError.js";

export const crearImplemento = async (req, res) => {
    try{
        const implemento = await servicioCrearImplemento(req.body, req.usuario?.id);
        res.status(201).json(implemento);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerImplementos = async (req, res)=>{
     try{
      const implemento = await servicioLeerImplemento();
        res.status(200).json(implemento);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarImplemento= async (req, res )=>{
    try{
        const Id=Number(req.params.id)
        const implemento=await servicioActualizarImplemento(Id,req.body, req.usuario?.id);
        res.status(200).json(implemento);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarImplemento=async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarImplemento(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
