import { ApiUserController } from "../Api/ApiUserController";
import { ApiUserResourceController } from "../Api/ApiUserResourceController";
import { LoginController } from "../Auth/LoginController";
import { RegistrationController } from "../Auth/RegistrationController";
import { HomeController } from "../HomeController";
import {BaseKernel} from "./BaseKernel";
import { Controller } from "./Controller";
import {ResetPassword} from '../Auth/ResetPassword'
import { ApiResetPasswordController } from "../Api/ApiResetPasswordController";
import {ApiCategoryController} from "../Api/ApiCategoryController";
import {ApiQuizController} from "../Api/ApiQuizController";

export class Kernel extends BaseKernel{
    
    /**
     * @param {String} desiredClassName 
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName : string) : Controller {
        switch(desiredClassName) {
            case 'HomeController' : return HomeController.getInstance()
            case 'LoginController' : return LoginController.getInstance()
            case 'RegistrationController' : return RegistrationController.getInstance()
            case 'ApiUserResourceController' : return ApiUserResourceController.getInstance()
            case 'ApiUserController' : return ApiUserController.getInstance()
            case 'ResetPassword' : return ResetPassword.getInstance()
            case 'ApiResetPasswordController' : return ApiResetPasswordController.getInstance()
            case 'ApiCategoryController' : return ApiCategoryController.getInstance()
            case 'ApiQuizController' : return ApiQuizController.getInstance()
            default : throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }

}


import {Router} from "express";
export class Route {
    private static router: Router;

    static use(router : Router) {
        this.router = router
    }

    static get(route : string, action : Array<string>) {
        this.router.get('/', Kernel.map(action.join('@')))
    }

    static post(route : string, action : Array<string>) {
        this.router.post('/', Kernel.map(action.join('@')))
    }
}