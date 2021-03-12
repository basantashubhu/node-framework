"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseKernel = void 0;
const Middleware_1 = require("../../Middlewares/Middleware");
const Singleton_1 = require("./Singleton");
class BaseKernel extends Singleton_1.Singleton {
    /**
     * map string with controllers method
     * @returns {Function}
     * @param _controllerMethod
     */
    static map(_controllerMethod) {
        const self = this.getInstance();
        const controllerMethod = _controllerMethod.split('@');
        if (controllerMethod.length < 2) {
            throw "Couldn't map a controller";
        }
        const controller = self.createRelevantClass(controllerMethod[0]);
        const controllerFunction = controllerMethod[1];
        if (!(controllerFunction in controller)) {
            throw `Couldn't find a method [${controllerMethod[1]}] on class [${controllerMethod[0]}]`;
        }
        return self.handle(controller, controllerFunction);
    }
    handle(requestHandler, handlerFunction) {
        const handlerArray = [];
        const exclusive = requestHandler.exclusive.map(x => x.split(':')[0]);
        requestHandler.rules.forEach(rule => {
            if (requestHandler.excepts.indexOf(`${rule}:${handlerFunction}`) > -1)
                return;
            if (exclusive.indexOf(rule) > -1 && requestHandler.exclusive.length && requestHandler.exclusive.indexOf(`${rule}:${handlerFunction}`) < 0)
                return;
            handlerArray.push(Middleware_1.Middleware.resolve(rule));
        });
        handlerArray.push(requestHandler.resolve(handlerFunction).bind(requestHandler));
        return handlerArray;
    }
}
exports.BaseKernel = BaseKernel;
