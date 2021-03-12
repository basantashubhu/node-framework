import {Request, Response, NextFunction} from 'express'
import {Singleton} from '../Controllers/Kernel/Singleton'

interface AbstractMiddlewareInterface {
    handle(request : Request, response : Response, next : NextFunction) : void
}

export abstract class AbstractMiddleware extends Singleton implements AbstractMiddlewareInterface{

    abstract handle(request : Request, response : Response, next : NextFunction) : void

}

export abstract class Middleware extends AbstractMiddleware{
    use() {
        return this.handle.bind(this)
    }
}