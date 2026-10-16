import {
    servicioCrearUsuario,
    servicioLeerUsuario,
    servicioActualizarUsuario,
    servicioEliminarUsuario
} from "../service/usuario.service.js"
import { manejarError } from "../utils/manejarError.js";

export const createUsuario= async (req, res)=>{
    try{
        const usuario = await servicioCrearUsuario(req.body);
        res.status(201).json(usuario);
    }catch (error){
        manejarError(res, error, 500);
    }
};

export const leerUsuario= async (req, res)=>{
     try{
      const usuario = await servicioLeerUsuario();
        res.status(200).json(usuario);
        }catch (error){
            manejarError(res, error, 500);
        }
};
export const actualizarUsuario= async (req, res)=>{
    try{
        const Id=Number(req.params.id)
        const user=await servicioActualizarUsuario(Id,req.body);
        res.status(200).json(user);
    }catch (error){
        manejarError(res, error, 500);
    }
};
export const eliminarUsuario=async(req, res)=>{
    try{
        const id = Number (req.params.id);
        await servicioEliminarUsuario(id);
        res.status(204).send();
    }catch (error){
        manejarError(res, error, 500);
    }

};
