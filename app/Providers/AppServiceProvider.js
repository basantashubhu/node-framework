"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServiceProvider = void 0;
const ServiceProvider_1 = require("./ServiceProvider");
const hbs_1 = __importDefault(require("hbs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const layouts = require('handlebars-layouts');
class AppServiceProvider extends ServiceProvider_1.ServiceProvider {
    boot() {
    }
    register() {
        hbs_1.default.handlebars.registerHelper(layouts(hbs_1.default.handlebars));
        hbs_1.default.registerPartials(path_1.default.join(process.cwd(), 'views', 'partials'));
        hbs_1.default.registerPartials(path_1.default.join(process.cwd(), 'views', 'template'));
        this.app.set('view engine', 'hbs');
        this.app.use(express_1.default.static('public'));
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan_1.default('dev'));
        }
    }
}
exports.AppServiceProvider = AppServiceProvider;
