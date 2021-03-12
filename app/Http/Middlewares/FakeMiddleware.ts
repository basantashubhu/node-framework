import {Request, Response, NextFunction} from "express"
import {Middleware} from './AbstractMiddleware'

export class FakeMiddleware extends Middleware {
    handle(request : Request, response : Response, next : NextFunction) {
        next()
    }
}