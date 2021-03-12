import { ServiceProvider } from "./ServiceProvider";
import { Middleware } from "../Http/Middlewares/Middleware"
import { Kernel } from "../Kernel";
import { NextFunction, Request, Response } from "express";

export class MiddlewareServiceProvider extends ServiceProvider {
    kernel : Kernel|null = null
    boot() {
        this.kernel = new Kernel()
    }
    register() {
        if (this.kernel !== null) {
            this.kernel.middlewares.forEach(rule => {
                this.app.use((request : Request, response : Response, next : NextFunction) => {
                    Middleware.resolve(rule)(request, response, next)
                })
            })
        }
    }
}