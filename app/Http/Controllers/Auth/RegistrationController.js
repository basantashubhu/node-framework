"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationController = void 0;
const Controller_1 = require("../Kernel/Controller");
const User_1 = require("../../../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Transporter_1 = __importDefault(require("../../../Mail/Transporter"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ResetEmail_1 = require("../../../models/ResetEmail");
class RegistrationController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.round = process.env.SALT || 10;
        this.BASE_URL = process.env.BASE_URL || 'http://localhost:' + process.env.PORT;
    }
    register(request, response) {
        const salt = bcryptjs_1.default.genSaltSync(Number(this.round));
        if (!this.validate(request, response)) {
            return;
        }
        User_1.User.findOne({ email: request.body.email }, (err, user) => {
            if (!user) {
                const user = new User_1.User({
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    email: request.body.email,
                    password: bcryptjs_1.default.hashSync(request.body.password, salt)
                });
                user.save().then((user) => {
                    const transporter = Transporter_1.default.create();
                    transporter.sendMail({
                        to: user.email,
                        from: Transporter_1.default.from(),
                        subject: 'Please confirm your email address',
                        html: `<p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                                <p>Please take a second to make sure we have your correct email address. <br/></p>
                                <p><a href="${this.BASE_URL}/email/confirm/${user.id}?email=${user.email}"><strong>Confirm your email address</strong></a><br/><br/></p>
                                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                                <p>Yours truly, <br/>
                                Live Quiz Team <br/>
                                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                                The Drive to Develop</p>`
                    }).then(function (info) {
                        const resetEmail = new ResetEmail_1.ResetEmail({
                            messageId: info.messageId,
                            messageUrl: nodemailer_1.default.getTestMessageUrl(info)
                        });
                        resetEmail.save();
                        response.send({ user });
                    }, function (err) {
                        response.status(500).send({ message: err.message });
                    });
                }).catch(function (err) {
                    response.status(500).send({ message: err.message });
                });
            }
            else {
                response.status(500).send({ message: 'User already exists with this email address.' });
            }
        });
    }
    veryEmail(request, response) {
        User_1.User.findOne({
            email: request.query.email,
            code: request.query.code
        }, function (err, user) {
            if (err)
                return response.render('errors/500', {
                    message: err.message,
                });
            if (!user)
                return response.render('errors/404', {
                    message: 'User does not exists'
                });
            if (!user.verifiedAt) {
                user.verifiedAt = new Date();
                user.save();
            }
            response.render('auth/email_confirmed');
        });
    }
}
exports.RegistrationController = RegistrationController;
