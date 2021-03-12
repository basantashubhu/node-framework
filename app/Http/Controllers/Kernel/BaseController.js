"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const Singleton_1 = require("./Singleton");
class BaseController extends Singleton_1.Singleton {
    constructor() {
        super();
        this.rules = [];
        this.excepts = [];
        this.exclusive = [];
    }
    middleware(...middlewares) {
        this.rules = [...this.rules, ...middlewares];
        return this;
    }
    except(guard, ...functions) {
        this.middleware(guard);
        this.excepts = [...this.excepts, ...functions.map(func => `${guard}:${func}`)];
        return this;
    }
    only(guard, ...functions) {
        this.middleware(guard);
        this.exclusive = [...this.exclusive, ...functions.map(func => `${guard}:${func}`)];
        return this;
    }
    resolve(method) {
        return this[method];
    }
}
exports.BaseController = BaseController;
