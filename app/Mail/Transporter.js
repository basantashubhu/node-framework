"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class Transporter {
    constructor() {
        this.host = "smtp.ethereal.email";
        this.port = 587;
        this.secure = false;
        this.auth = {
            user: "bxvaat4b5ojdj4kc@ethereal.email",
            pass: "FMxPKqZ6H9CZTfQaRw"
        };
    }
    from(fromName = null, fromAddress = null) {
        if (!fromName && process.env.MAIL_FROM_NAME) {
            fromName = process.env.MAIL_FROM_NAME;
        }
        if (!fromAddress && process.env.MAIL_FROM_ADDRESS) {
            fromAddress = process.env.MAIL_FROM_ADDRESS;
        }
        return `"${fromName}" <${fromAddress}>`;
    }
    create() {
        return nodemailer_1.default.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: this.auth
        });
    }
}
exports.default = new Transporter();
/*
    const transporter = Transporter.create()

    transporter.sendMail({
        to: user.email,
        from: Transporter.from(),
        subject: 'Please confirm your email address',
        html: `<p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                <p>Please take a second to make sure we have your correct email address. <br/></p>
                <p><a href="${this.BASE_URL}/email/confirm/${user.id}?email=${user.email}"><strong>Confirm your email address</strong></a><br/></p>
                <p>Or try this code,</p>
                <p>Code : ${code} <br/><br/></p>
                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                The Drive to Develop</p>`

    }).then(function (info: SentMessageInfo) {

        const resetEmail = new ResetEmail({
            messageId: info.messageId,
            messageUrl: nodemailer.getTestMessageUrl(info)
        })
        resetEmail.save()
        response.send(user)

    }, function (err: any) {
        response.status(500).send({ message: err.message })
    })
*/
