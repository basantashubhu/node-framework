"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareServiceProvider = void 0;
const ServiceProvider_1 = require("./ServiceProvider");
const Middleware_1 = require("../Http/Middlewares/Middleware");
const Kernel_1 = require("../Kernel");
class MiddlewareServiceProvider extends ServiceProvider_1.ServiceProvider {
    constructor() {
        super(...arguments);
        this.kernel = null;
    }
    boot() {
        this.kernel = new Kernel_1.Kernel();
    }
    register() {
        if (this.kernel !== null) {
            this.kernel.middlewares.forEach(rule => {
                this.app.use((request, response, next) => {
                    Middleware_1.Middleware.resolve(rule)(request, response, next);
                });
            });
        }
    }
}
exports.MiddlewareServiceProvider = MiddlewareServiceProvider;
