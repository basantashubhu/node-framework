import {Request, Response, NextFunction } from "express"
import {AuthMiddleware} from "./AuthMiddleware"
import { FakeMiddleware } from "./FakeMiddleware"
import { TrimString } from "./TrimString"
import {GuestMiddleware} from './GuestMiddleware'
import {AdminGuard} from "./AdminGuard";

export abstract class Middleware {
    /**
     * @param {*} request
     * @param {*} response
     * @param next
     */
    abstract handle(request : Request, response : Response, next : NextFunction) : void

    /**
     * @return {Function} Function
     * @param middleware
     */
    static resolve(middleware : string) : Function {
        let middlewareInstance : Middleware = FakeMiddleware.getInstance()
        switch(middleware) {
            case 'Auth' : middlewareInstance =  AuthMiddleware.getInstance()
                break
            case 'TrimString' : middlewareInstance = TrimString.getInstance()
                break
            case 'Guest' : middlewareInstance = GuestMiddleware.getInstance()
                break
            case 'AdminGuard' : middlewareInstance = AdminGuard.getInstance()
                break
        }
        return middlewareInstance.handle.bind(middlewareInstance)
    }
}