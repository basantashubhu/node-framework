import { Controller } from "../Kernel/Controller";
import {Request, Response} from 'express'
import { User } from "../../../models/User";
import bcrypt from 'bcryptjs'
import Transporter from '../../../Mail/Transporter'
import nodemailer, {SentMessageInfo} from 'nodemailer'
import { ResetEmail } from "../../../models/ResetEmail";

export class RegistrationController extends Controller {

    round : any = process.env.SALT || 10
    BASE_URL = process.env.BASE_URL || 'http://localhost:' + process.env.PORT

    register(request : Request, response : Response) {
        const salt = bcrypt.genSaltSync(Number(this.round))
        if (!this.validate(request, response)) {
            return
        }
        User.findOne({email : request.body.email}, (err : any, user : any) => {
            if(!user) {

                const user = new User({
                    first_name : request.body.first_name,
                    last_name : request.body.last_name,
                    email : request.body.email,
                    password : bcrypt.hashSync(request.body.password, salt)
                })

                user.save().then((user : any) => {

                    const transporter = Transporter.create()

                    transporter.sendMail({
                        to : user.email,
                        from : Transporter.from(),
                        subject : 'Please confirm your email address',
                        html : `<p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                                <p>Please take a second to make sure we have your correct email address. <br/></p>
                                <p><a href="${ this.BASE_URL }/email/confirm/${ user.id }?email=${ user.email }"><strong>Confirm your email address</strong></a><br/><br/></p>
                                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                                <p>Yours truly, <br/>
                                Live Quiz Team <br/>
                                <a href="${ this.BASE_URL }">${ this.BASE_URL }</a> <br/>
                                The Drive to Develop</p>`

                    }).then(function (info : SentMessageInfo) {

                        const resetEmail = new ResetEmail({
                            messageId : info.messageId,
                            messageUrl : nodemailer.getTestMessageUrl(info)
                        })
                        resetEmail.save()
                        response.send({user})

                    }, function (err : any) {
                        response.status(500).send({ message : err.message })
                    })


                }).catch(function(err) {
                    response.status(500).send({message: err.message})
                })
            } else {
                response.status(500).send({message: 'User already exists with this email address.'})
            }
        });

        
    }

    veryEmail(request : Request, response : Response) {
        User.findOne({
            email : request.query.email,
            code : request.query.code
        }, function (err : any, user : any) {
            if (err) return response.render('errors/500', {
                message : err.message,
            })
            if (!user) return response.render('errors/404', {
                message : 'User does not exists'
            })

            if (!user.verifiedAt) {
                user.verifiedAt = new Date()
                user.save()
            }
            response.render('auth/email_confirmed')
        })
    }
}