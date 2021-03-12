import {Controller} from '../Kernel/Controller'
import {Request, Response} from 'express'
import {User} from '../../../models/User'
import Transporter from '../../../Mail/Transporter'
import nodemailer, {SentMessageInfo} from 'nodemailer'
import {ResetEmail} from '../../../models/ResetEmail'
import handlebars from 'handlebars'
import bcryptjs from 'bcryptjs'


export class ResetPassword extends Controller {

    BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
    round = process.env.SALT || 10

    reset(request: Request, response: Response) {

        User.findOne({ email : request.body.email }, (err : any, user : any) => {
            if (err) {
                return response.status(500).send({ message : err.message })
            }
            if (!user) {
                return response.status(404).send([
                    {
                        param : 'email',
                        msg : 'User doesn\'t exists with that email',
                        location : 'body'
                    }
                ])
            }
            user.token = bcryptjs.hashSync((new Date).getTime().toString())
            user.save()
            const transporter = Transporter.create()
            transporter.sendMail({
                from : Transporter.from(),
                to : user.email,
                subject : 'Password Reset Email',
                html : `<p>Dear ${user.first_name}, <br/></p>
                        <p>To reset your password click the link below:<br/></p>
                        <p><a href="${ this.BASE_URL }/password/reset?token=${user.token}">Reset password</a><br/></p>
                        <p>If you did not request a password reset from Live Quiz Account, you can safely ignore this email.</p>
                        <p>Yours truly, <br/>
                        Live Quiz Team <br/>
                        <a href="${ this.BASE_URL }">${ this.BASE_URL }</a> <br/>
                        The Drive to Develop</p>`,

            }).then(function (info: SentMessageInfo) {
                const resetEmail = new ResetEmail({
                    messageId : info.messageId,
                    messageUrl : nodemailer.getTestMessageUrl(info)
                })
                resetEmail.save()
                response.send({})
            }, function (err : any) {
                response.status(500).send({ message : err.message })
            })
        })
    }

    emailList(request : Request, response : Response) {
        ResetEmail.find().sort({'createdAt' : -1}).exec(function (err : any, emails : any[]) {
            response.send(emails.map(x => {
                return `<li>
                    <a target="_blank" href="${ x.messageUrl }">
                        ${ handlebars.Utils.escapeExpression(x.messageId) }
                        ${ x.createdAt }
                    </a>
                </li>`
            }).join(''))
        })
    }

    resetPasswordForm(request : Request, response : Response) {
        User.findOne({ token : request.query.token }, function(err : any, user : any) {
            if(err) {
                return response.status(500).render('errors/500', {
                    message : err.message
                })
            }
            if(!user) {
                return response.status(404).render('errors/404', {
                    message : 'No reset password request found.'
                })
            }
            response.render('auth/reset_password', {
                token : user.token,
                email : user.email
            });
        })
    }

    resetPassword(request : Request, response : Response) {
        if(!this.validate(request, response)) {
            return;
        }
        const salt = bcryptjs.genSaltSync(Number(this.round))
        User.findOne({ token : request.body.token }, function(err : any, user : any) {
            if(err) return response.status(500).send({ message : err.message })
            if(!user) return response.status(404).send({ message : 'No reset password request found.' })
            if(request.body.password !== request.body.password_confirmation) return response.status(422).send([{ msg : 'Password confirmation did not match password' }])
            user.password = bcryptjs.hashSync(request.body.password, salt)
            user.token = null
            user.save()
            response.send('success')     
        })
    }
}