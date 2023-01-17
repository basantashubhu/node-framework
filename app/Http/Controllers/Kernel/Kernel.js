"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = exports.Kernel = void 0;
const ApiUserController_1 = require("../Api/ApiUserController");
const ApiUserResourceController_1 = require("../Api/ApiUserResourceController");
const LoginController_1 = require("../Auth/LoginController");
const RegistrationController_1 = require("../Auth/RegistrationController");
const HomeController_1 = require("../HomeController");
const BaseKernel_1 = require("./BaseKernel");
const ResetPassword_1 = require("../Auth/ResetPassword");
const ApiResetPasswordController_1 = require("../Api/ApiResetPasswordController");
const ApiCategoryController_1 = require("../Api/ApiCategoryController");
const ApiQuizController_1 = require("../Api/ApiQuizController");
class Kernel extends BaseKernel_1.BaseKernel {
    /**
     * @param {String} desiredClassName
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName) {
        switch (desiredClassName) {
            case 'HomeController': return HomeController_1.HomeController.getInstance();
            case 'LoginController': return LoginController_1.LoginController.getInstance();
            case 'RegistrationController': return RegistrationController_1.RegistrationController.getInstance();
            case 'ApiUserResourceController': return ApiUserResourceController_1.ApiUserResourceController.getInstance();
            case 'ApiUserController': return ApiUserController_1.ApiUserController.getInstance();
            case 'ResetPassword': return ResetPassword_1.ResetPassword.getInstance();
            case 'ApiResetPasswordController': return ApiResetPasswordController_1.ApiResetPasswordController.getInstance();
            case 'ApiCategoryController': return ApiCategoryController_1.ApiCategoryController.getInstance();
            case 'ApiQuizController': return ApiQuizController_1.ApiQuizController.getInstance();
            default: throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }
}
exports.Kernel = Kernel;
class Route {
    static use(router) {
        this.router = router;
    }
    static get(route, action) {
        this.router.get('/', Kernel.map(action.join('@')));
    }
    static post(route, action) {
        this.router.post('/', Kernel.map(action.join('@')));
    }
}
exports.Route = Route;
