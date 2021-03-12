import express from 'express'

interface ServiceProviderInterface {
    app: express.Application
}

export abstract class ServiceProvider implements ServiceProviderInterface {
    app: express.Application

    constructor(app: express.Application) {
        this.app = app
    }

    abstract boot(): void
    abstract register(): void
}