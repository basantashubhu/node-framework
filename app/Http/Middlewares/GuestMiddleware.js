"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestMiddleware = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class GuestMiddleware extends AbstractMiddleware_1.Middleware {
    constructor() {
        super(...arguments);
        this.app_key = process.env.APP_KEY || 'basantashubhu';
    }
    handle(request, response, next) {
        const verifier = this.verifier(request, response, next);
        if (request.cookies.token) {
            verifier.token(request.cookies.token);
        }
        else if (request.headers.authorization) {
            const token = request.headers.authorization.replace('Bearer ', '');
            verifier.token(token);
        }
        else {
            next();
        }
    }
    verifier(request, response, next) {
        return {
            app_key: this.app_key,
            token(token) {
                jsonwebtoken_1.default.verify(token, this.app_key, (err) => {
                    if (!err)
                        return this.error();
                    next();
                });
            },
            error(message = null) {
                response.status(400).send({ message: message || 'Please logout to continue' });
            }
        };
    }
}
exports.GuestMiddleware = GuestMiddleware;
