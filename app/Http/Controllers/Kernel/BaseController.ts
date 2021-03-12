import {Singleton} from './Singleton'

export class BaseController extends Singleton{
    rules : string[]
    excepts : string[]
    exclusive : string[]

    constructor() {
        super()
        this.rules = []
        this.excepts = []
        this.exclusive = []
    }

    middleware(...middlewares : string[]) {
        this.rules = [...this.rules, ...middlewares]
        return this
    }

    except(guard : string, ...functions : string[]) {
        this.middleware(guard)
        this.excepts = [...this.excepts, ...functions.map(func => `${ guard }:${ func }`)]
        return this
    }

    only(guard : string, ...functions : string[]) {
        this.middleware(guard)
        this.exclusive = [...this.exclusive, ...functions.map(func => `${ guard }:${ func }`)]
        return this
    }

    resolve(method : string) : Function {
        return (this as any)[method]
    }
}