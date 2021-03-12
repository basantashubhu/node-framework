import {AppServiceProvider} from '../Providers/AppServiceProvider'
import { MiddlewareServiceProvider } from '../Providers/MiddlewareServiceProvider'
import { RouteServiceProvider } from '../Providers/RouterServiceProvider'
import { AbstractContainer } from './AbstractContainer'

export class ServiceContainer extends AbstractContainer {
    register() {
        this.pipes = [
            new MiddlewareServiceProvider(this.app),
            new AppServiceProvider(this.app),
            new RouteServiceProvider(this.app),
        ]
    }
}