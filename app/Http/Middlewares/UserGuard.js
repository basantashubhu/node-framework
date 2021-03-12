"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGuard = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
class UserGuard extends AbstractMiddleware_1.Middleware {
    handle(request, response, next) {
        var _a;
        if (((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('userType')) === 'user')
            return next();
        response.status(401).json({ message: 'You are not supposed to be here' });
    }
}
exports.UserGuard = UserGuard;
