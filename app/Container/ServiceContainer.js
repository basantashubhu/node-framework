"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContainer = void 0;
const AppServiceProvider_1 = require("../Providers/AppServiceProvider");
const MiddlewareServiceProvider_1 = require("../Providers/MiddlewareServiceProvider");
const RouterServiceProvider_1 = require("../Providers/RouterServiceProvider");
const AbstractContainer_1 = require("./AbstractContainer");
class ServiceContainer extends AbstractContainer_1.AbstractContainer {
    register() {
        this.pipes = [
            new MiddlewareServiceProvider_1.MiddlewareServiceProvider(this.app),
            new AppServiceProvider_1.AppServiceProvider(this.app),
            new RouterServiceProvider_1.RouteServiceProvider(this.app),
        ];
    }
}
exports.ServiceContainer = ServiceContainer;
