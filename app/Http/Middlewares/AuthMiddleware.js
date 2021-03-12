"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
class AuthMiddleware extends AbstractMiddleware_1.Middleware {
    constructor() {
        super(...arguments);
        this.app_key = process.env.APP_KEY || 'basantashubhu';
    }
    handle(request, response, next) {
        const tokenVerifier = this.verifyNext(request, response, next);
        if (request.cookies.token) {
            tokenVerifier.token(request.cookies.token);
        }
        else if (!request.headers.authorization) {
            tokenVerifier.error();
        }
        else {
            const token = request.headers.authorization.replace('Bearer ', '');
            tokenVerifier.token(token);
        }
    }
    verifyNext(request, response, next) {
        return {
            app_key: this.app_key,
            token(token) {
                jsonwebtoken_1.default.verify(token, this.app_key, (err, decoded) => {
                    if (err)
                        return this.error(err.message);
                    request.decoded = decoded;
                    this.auth(decoded)
                        .catch(err => this.error(err.message))
                        .then(() => next());
                });
            },
            auth(decoded) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User_1.User.findById(decoded.data.id);
                    request.auth = {
                        user: (key = null) => key ? user[key] : user,
                        id: () => user.id
                    };
                });
            },
            error(message = null) {
                response.status(401).send({ message: message || 'Please login to continue' });
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
