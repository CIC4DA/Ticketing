import {Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error(parent-Class)/custom-error";

// express knows function with 4 inputs, is used for error middlewares. Hence after make it use in index.ts, now whenever we throw Error it will go through this middle ware

/// common error structure we created

// {
//     errors : {
//         message: string,
//         field ?: string
//     }[]
// }


export const errorHandler = (
    err: Error, 
    req:Request, 
    res:Response, 
    next: NextFunction
) => {
    // console.log("Something went wrong", err);
    console.log("asjdl;fkjasldfkjasdlk;fjasdf;kajsdf lkasjdflka ");
    if(err instanceof CustomError){
        return res.status(err.statusCode).send({errors : err.serializeError()});
    }

    res.status(400).send({
       errors : [{message : err.message}]
    });
}




