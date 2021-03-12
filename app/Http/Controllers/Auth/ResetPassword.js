"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const Controller_1 = require("../Kernel/Controller");
const User_1 = require("../../../models/User");
const Transporter_1 = __importDefault(require("../../../Mail/Transporter"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ResetEmail_1 = require("../../../models/ResetEmail");
const handlebars_1 = __importDefault(require("handlebars"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPassword extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        this.round = process.env.SALT || 10;
    }
    reset(request, response) {
        User_1.User.findOne({ email: request.body.email }, (err, user) => {
            if (err) {
                return response.status(500).send({ message: err.message });
            }
            if (!user) {
                return response.status(404).send([
                    {
                        param: 'email',
                        msg: 'User doesn\'t exists with that email',
                        location: 'body'
                    }
                ]);
            }
            user.token = bcryptjs_1.default.hashSync((new Date).getTime().toString());
            user.save();
            const transporter = Transporter_1.default.create();
            transporter.sendMail({
                from: Transporter_1.default.from(),
                to: user.email,
                subject: 'Password Reset Email',
                html: `<p>Dear ${user.first_name}, <br/></p>
                        <p>To reset your password click the link below:<br/></p>
                        <p><a href="${this.BASE_URL}/password/reset?token=${user.token}">Reset password</a><br/></p>
                        <p>If you did not request a password reset from Live Quiz Account, you can safely ignore this email.</p>
                        <p>Yours truly, <br/>
                        Live Quiz Team <br/>
                        <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                        The Drive to Develop</p>`,
            }).then(function (info) {
                const resetEmail = new ResetEmail_1.ResetEmail({
                    messageId: info.messageId,
                    messageUrl: nodemailer_1.default.getTestMessageUrl(info)
                });
                resetEmail.save();
                response.send({});
            }, function (err) {
                response.status(500).send({ message: err.message });
            });
        });
    }
    emailList(request, response) {
        ResetEmail_1.ResetEmail.find().sort({ 'createdAt': -1 }).exec(function (err, emails) {
            response.send(emails.map(x => {
                return `<li>
                    <a target="_blank" href="${x.messageUrl}">
                        ${handlebars_1.default.Utils.escapeExpression(x.messageId)}
                        ${x.createdAt}
                    </a>
                </li>`;
            }).join(''));
        });
    }
    resetPasswordForm(request, response) {
        User_1.User.findOne({ token: request.query.token }, function (err, user) {
            if (err) {
                return response.status(500).render('errors/500', {
                    message: err.message
                });
            }
            if (!user) {
                return response.status(404).render('errors/404', {
                    message: 'No reset password request found.'
                });
            }
            response.render('auth/reset_password', {
                token: user.token,
                email: user.email
            });
        });
    }
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
            if (request.body.password !== request.body.password_confirmation)
                return response.status(422).send([{ msg: 'Password confirmation did not match password' }]);
            user.password = bcryptjs_1.default.hashSync(request.body.password, salt);
            user.token = null;
            user.save();
            response.send('success');
        });
    }
}
exports.ResetPassword = ResetPassword;
