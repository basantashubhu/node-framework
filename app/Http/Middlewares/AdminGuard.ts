import {Middleware} from "./AbstractMiddleware";
import {Request, Response, NextFunction} from "express";

export class AdminGuard extends Middleware {
    handle(request: Request, response: Response, next: NextFunction): void {
        if (request.auth?.user('userType').toLowerCase() === 'admin')
            return next()

        response.status(401).json({message : 'You are not supposed to be here'})
    }
}