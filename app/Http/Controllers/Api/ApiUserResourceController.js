"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUserResourceController = void 0;
const Controller_1 = require("../Kernel/Controller");
const User_1 = require("../../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Mailjet_1 = __importDefault(require("../../../Mail/Mailjet"));
class ApiUserResourceController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.app_key = process.env.APP_KEY || 'basantashubhu';
        this.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    }
    /**
     * @route /api/v1/user/register
     * api user registration
     * @param request
     * @param response
     */
    register(request, response) {
        if (!this.validate(request, response)) {
            return;
        }
        const salt = bcryptjs_1.default.genSaltSync(Number(process.env.SALT || 10));
        const newUser = new User_1.User({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email: request.body.email,
            password: bcryptjs_1.default.hashSync(request.body.password, salt)
        });
        newUser.save().then((user) => {
            const code = Math.floor(1000 + Math.random() * 9000);
            user.code = 1234 || code;
            user.save();
            if (process.env.NODE_ENV === 'development') {
                return response.status(201).json({ data: user });
            }
            Mailjet_1.default.subject('Please confirm your email address');
            Mailjet_1.default.send({
                Name: user.first_name,
                Email: user.email
            }, `<p>Dear ${user.first_name}, <br/></p>
                <p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                <p>Please take a second to make sure we have your correct email address. <br/></p>
                <p><a href="${this.BASE_URL}/email/confirm?email=${user.email}&code=${code}"><strong>Confirm your email address</strong></a><br/></p>
                <p>Or try this code,</p>
                <p>Code : ${code} <br/></p>
                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                The Drive to Develop</p>`).then((result) => {
                // console.log(result.body)
                response.status(201).json({ data: user });
            })
                .catch((err) => {
                // console.log(err.statusCode)
                response.status(500).json({ message: err.message });
            });
        }).catch(function (err) {
            response.status(500).json({ message: err.message });
        });
    }
    /**
     * @router /api/v1/user/authenticate
     * api user authentication
     * @param request
     * @param response
     */
    authenticate(request, response) {
        if (!this.validate(request, response)) {
            return;
        }
        const expiresIn = process.env.TOKEN_EXPIRY || '1hr';
        User_1.User.findOne({ email: request.body.email }, (err, user) => {
            if (err)
                return response.status(500).json({ message: err.message });
            if (!bcryptjs_1.default.compareSync(request.body.password, user.password))
                return response.status(422).json({ errors: { email: 'Invalid email address or password' } });
            if (!user.verifiedAt)
                return response.status(403).json({ message: 'Email is not verified' });
            jsonwebtoken_1.default.sign({ data: { id: user.id } }, this.app_key, { expiresIn }, function (err, token) {
                if (err)
                    return response.status(500).json({ message: err.message });
                response.json({ token });
            });
        });
    }
    /**
     * @route /api/v1/token
     * Validate token from body
     * @param request
     * @param response
     */
    validateToken(request, response) {
        const expiresIn = process.env.TOKEN_EXPIRY || '1hr';
        jsonwebtoken_1.default.verify(request.body.token, this.app_key, (err, decoded) => {
            // Unauthorized
            if (err)
                return response.status(401).json({ message: err.message });
            jsonwebtoken_1.default.sign(decoded, this.app_key, { expiresIn }, function (err, token) {
                if (err)
                    return response.status(500).json({ message: err.message });
                response.json({ token });
            });
        });
    }
    /**
     * @route /api/v1/email/confirm/:id
     * Verify the email address of newly registered user
     * @param request
     * @param response
     */
    veryEmail(request, response) {
        if (!this.validate(request, response))
            return;
        User_1.User.findOne({
            email: request.query.email,
        }, function (err, user) {
            if (err)
                return response.status(500).json({ message: err.message });
            if (!user)
                return response.status(404).json({ message: 'User does not exists' });
            if (Number(user.code) !== Number(request.query.code))
                return response.status(422).json({ errors: { code: "Confirmation code did not match" } });
            if (!user.verifiedAt) {
                user.verifiedAt = new Date();
                user.save();
            }
            response.json({ data: user });
        });
    }
}
exports.ApiUserResourceController = ApiUserResourceController;
