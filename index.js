"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ServiceContainer_js_1 = require("./app/Container/ServiceContainer.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// load env
dotenv_1.default.config();
// database connection
require('./database/mongoose');
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
const serviceContainer = new ServiceContainer_js_1.ServiceContainer(app);
serviceContainer.run();
app.listen(process.env.PORT || 9000, () => {
    console.log('Server started at: ', process.env.PORT || 9000);
});
