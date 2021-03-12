import {Middleware} from "./AbstractMiddleware";
import {Request, Response, NextFunction} from 'express'

export class UserGuard extends Middleware {
    handle(request: Request, response: Response, next: NextFunction): void {
        if (request.auth?.user('userType') === 'user')
            return next()

        response.status(401).json({message : 'You are not supposed to be here'})
    }
}