import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BaseController } from "./BaseController";


export class Controller extends BaseController{
    validate(request : Request, response : Response) : boolean{
        const v = validationResult(request)
        if(!v.isEmpty()) {
            const errors : {[name : string] : string} = {}
            const validationsErrors = v.array()
            for (let index = 0; index < validationsErrors.length; index++) {
                const error = validationsErrors[index];
                if(error.param in errors) continue
                errors[error.param] = error.msg
            }
            response.status(422).send({errors, message : "Validation failed"}).end()
            return false
        }

        return true
    }
}