import {Middleware} from './AbstractMiddleware'
import {Request, Response, NextFunction} from 'express'

export class TrimString extends Middleware {
    handle(request : Request, resposne : Response, next : NextFunction) {

        if (request.params) {
            this.trimStringProperties(request.params)
        }
        if (request.body) {
            this.trimStringProperties(request.body)
        }
        if (request.query) {
            this.trimStringProperties(request.query)
        }

        next()
    }

    trimStringProperties (obj : any) : void {
        if (obj !== null && typeof obj === 'object') {
            for (const prop in obj ) {
                // if the property is an object trim it too
                if (typeof obj[prop] === 'object' ) {
                    this.trimStringProperties(obj[prop]);
                    continue
                }                 
                // if it's a string remove begin and end whitespaces
                if (typeof obj[prop] === 'string' ) {
                    obj[prop] = obj[prop].trim();
                }   
            }
        }
    }
}