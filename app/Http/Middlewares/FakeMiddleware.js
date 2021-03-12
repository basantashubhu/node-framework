"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeMiddleware = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
class FakeMiddleware extends AbstractMiddleware_1.Middleware {
    handle(request, response, next) {
        next();
    }
}
exports.FakeMiddleware = FakeMiddleware;
