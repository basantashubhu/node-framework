"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractContainer = void 0;
class AbstractContainer {
    constructor(app) {
        this.app = app;
        this.pipes = [];
        this.register();
    }
    pipeline() {
        for (const pip in this.pipes) {
            this.pipes[pip].boot();
            this.pipes[pip].register();
        }
    }
    run() {
        this.pipeline();
    }
}
exports.AbstractContainer = AbstractContainer;
