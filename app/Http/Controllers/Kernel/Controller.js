"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_validator_1 = require("express-validator");
const BaseController_1 = require("./BaseController");
class Controller extends BaseController_1.BaseController {
    validate(request, response) {
        const v = express_validator_1.validationResult(request);
        if (!v.isEmpty()) {
            const errors = {};
            const validationsErrors = v.array();
            for (let index = 0; index < validationsErrors.length; index++) {
                const error = validationsErrors[index];
                if (error.param in errors)
                    continue;
                errors[error.param] = error.msg;
            }
            response.status(422).send({ errors, message: "Validation failed" }).end();
            return false;
        }
        return true;
    }
}
exports.Controller = Controller;
