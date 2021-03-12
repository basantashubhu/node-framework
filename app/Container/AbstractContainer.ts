import express from 'express'
import { ServiceProvider } from '../Providers/ServiceProvider'

export abstract class AbstractContainer {
    app : express.Application
    pipes : ServiceProvider[]

    constructor(app : express.Application) {
        this.app = app
        this.pipes = []

        this.register()
    }

    abstract register() : void
    
    pipeline() {
        for(const pip in this.pipes) {
            this.pipes[pip].boot()
            this.pipes[pip].register()
        }
    }

    run() {
        this.pipeline()
    }
}