"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = exports.AbstractMiddleware = void 0;
const Singleton_1 = require("../Controllers/Kernel/Singleton");
class AbstractMiddleware extends Singleton_1.Singleton {
}
exports.AbstractMiddleware = AbstractMiddleware;
class Middleware extends AbstractMiddleware {
    use() {
        return this.handle.bind(this);
    }
}
exports.Middleware = Middleware;
