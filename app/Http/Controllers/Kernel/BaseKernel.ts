import {Middleware} from "../../Middlewares/Middleware";
import { Controller } from "./Controller";
import {Singleton} from './Singleton'

export abstract class BaseKernel extends Singleton{

     /**
      * map string with controllers method
      * @returns {Function}
      * @param _controllerMethod
      */
    static map(_controllerMethod : string) {
        const self = this.getInstance()
        
        const controllerMethod : string[] = _controllerMethod.split('@')
        if(controllerMethod.length < 2) {
            throw "Couldn't map a controller";
        }

        const controller : Controller = self.createRelevantClass(controllerMethod[0])
        const controllerFunction : string = controllerMethod[1]
        if(!(controllerFunction in controller)) {
            throw `Couldn't find a method [${controllerMethod[1]}] on class [${controllerMethod[0]}]`
        }

        return self.handle(controller, controllerFunction)
    }

    handle(requestHandler : Controller, handlerFunction : string) {
        const handlerArray: Function[] = []
        const exclusive = requestHandler.exclusive.map(x => x.split(':')[0])
        requestHandler.rules.forEach(rule => {
            if (requestHandler.excepts.indexOf(`${ rule }:${ handlerFunction }`) > -1) return
            if (exclusive.indexOf(rule) > -1 && requestHandler.exclusive.length && requestHandler.exclusive.indexOf(`${ rule }:${ handlerFunction }`) < 0) return
            handlerArray.push(Middleware.resolve(rule))
        })
        handlerArray.push(requestHandler.resolve(handlerFunction).bind(requestHandler))

        return handlerArray
    }

    abstract createRelevantClass(desiredClassName : string) : Controller
}