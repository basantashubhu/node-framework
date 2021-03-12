"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
class Singleton {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new this();
        }
        return this.instance;
    }
}
exports.Singleton = Singleton;
Singleton.instance = null;
