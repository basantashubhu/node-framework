"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
class AdminGuard extends AbstractMiddleware_1.Middleware {
    handle(request, response, next) {
        var _a;
        if (((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('userType').toLowerCase()) === 'admin')
            return next();
        response.status(401).json({ message: 'You are not supposed to be here' });
    }
}
exports.AdminGuard = AdminGuard;
