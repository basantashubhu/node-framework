"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const AuthMiddleware_1 = require("./AuthMiddleware");
const FakeMiddleware_1 = require("./FakeMiddleware");
const TrimString_1 = require("./TrimString");
const GuestMiddleware_1 = require("./GuestMiddleware");
const AdminGuard_1 = require("./AdminGuard");
class Middleware {
    /**
     * @return {Function} Function
     * @param middleware
     */
    static resolve(middleware) {
        let middlewareInstance = FakeMiddleware_1.FakeMiddleware.getInstance();
        switch (middleware) {
            case 'Auth':
                middlewareInstance = AuthMiddleware_1.AuthMiddleware.getInstance();
                break;
            case 'TrimString':
                middlewareInstance = TrimString_1.TrimString.getInstance();
                break;
            case 'Guest':
                middlewareInstance = GuestMiddleware_1.GuestMiddleware.getInstance();
                break;
            case 'AdminGuard':
                middlewareInstance = AdminGuard_1.AdminGuard.getInstance();
                break;
        }
        return middlewareInstance.handle.bind(middlewareInstance);
    }
}
exports.Middleware = Middleware;
