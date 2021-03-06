"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResetPasswordController = void 0;
const Controller_1 = require("../Kernel/Controller");
const User_1 = require("../../../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Mailjet_1 = __importDefault(require("../../../Mail/Mailjet"));
class ApiResetPasswordController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        this.round = process.env.SALT || 10;
    }
    /**
     * @route /api/v1/reset/password
     * password reset request
     * @param request
     * @param response
     */
    reset(request, response) {
        if (!this.validate(request, response))
            return;
        User_1.User.findOne({ email: request.body.email }, (err, user) => {
            if (err)
                return response.status(500).send({ message: err.message });
            if (!user)
                return response.status(404).json({ message: 'User does not exists' });
            user.token = bcryptjs_1.default.hashSync((new Date).getTime().toString());
            user.save();
            Mailjet_1.default.subject('Password Reset Email');
            Mailjet_1.default.send({
                Email: user.email,
                Name: user.first_name
            }, `<p>Dear ${user.first_name}, <br/></p>
                <p>To reset your password click the link below:<br/></p>
                <p><a href="${this.BASE_URL}/password/reset?token=${user.token}">Reset password</a><br/></p>
                <p>If you did not request a password reset from Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                The Drive to Develop</p>`).then(function (info) {
                response.json({});
            }, function (err) {
                response.status(500).json({ message: err.message });
            });
        });
    }
    /**
     * @route /api/v1/password/reset
     * change password on reset
     * @param request
     * @param response
     */
    resetPassword(request, response) {
        if (!this.validate(request, response)) {
            return;
        }
        const salt = bcryptjs_1.default.genSaltSync(Number(this.round));
        User_1.User.findOne({ token: request.body.token }, function (err, user) {
            if (err)
                return response.status(500).send({ message: err.message });
            if (!user)
                return response.status(404).send({ message: 'No reset password request found.' });
            // if(request.body.password !== request.body.password_confirmation) 
            // return response.status(422).send([{ msg : 'Password confirmation did not match password' }])
            user.password = bcryptjs_1.default.hashSync(request.body.password, salt);
            user.token = null;
            user.save();
            response.json({ message: 'success' });
        });
    }
}
exports.ApiResetPasswordController = ApiResetPasswordController;
