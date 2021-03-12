"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimString = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
class TrimString extends AbstractMiddleware_1.Middleware {
    handle(request, resposne, next) {
        if (request.params) {
            this.trimStringProperties(request.params);
        }
        if (request.body) {
            this.trimStringProperties(request.body);
        }
        if (request.query) {
            this.trimStringProperties(request.query);
        }
        next();
    }
    trimStringProperties(obj) {
        if (obj !== null && typeof obj === 'object') {
            for (const prop in obj) {
                // if the property is an object trim it too
                if (typeof obj[prop] === 'object') {
                    this.trimStringProperties(obj[prop]);
                    continue;
                }
                // if it's a string remove begin and end whitespaces
                if (typeof obj[prop] === 'string') {
                    obj[prop] = obj[prop].trim();
                }
            }
        }
    }
}
exports.TrimString = TrimString;
