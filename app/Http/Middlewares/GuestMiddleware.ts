import {Middleware} from './AbstractMiddleware'
import e, {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'

export class GuestMiddleware extends Middleware {

    app_key : string = process.env.APP_KEY || 'basantashubhu'

    handle(request: e.Request, response: e.Response, next: e.NextFunction): void {
        const verifier = this.verifier(request, response, next)
        if(request.cookies.token) {
            verifier.token(request.cookies.token)
        } else if (request.headers.authorization) {
            const token = request.headers.authorization.replace('Bearer ', '')
            verifier.token(token)
        }  else {
            next()
        }
    }

    verifier(request : Request, response : Response, next : NextFunction) {
        return {
            app_key : this.app_key,
            token(token : string) {
                jwt.verify(token, this.app_key, (err : any) => {
                    if(!err) return this.error()

                    next()
                })
            },
            error(message : string|null = null) {
                response.status(400).send({message: message || 'Please logout to continue'})
            }
        }
    }
}