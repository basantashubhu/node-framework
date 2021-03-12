import {Controller} from '../Kernel/Controller'
import {Request, Response} from 'express'
import {User} from '../../../models/User'
import Transporter from '../../../Mail/Transporter'
import nodemailer, {SentMessageInfo} from 'nodemailer'
import {ResetEmail} from '../../../models/ResetEmail'
import handlebars from 'handlebars'
import bcryptjs from 'bcryptjs'
import Mailjet from '../../../Mail/Mailjet'


export class ApiResetPasswordController extends Controller {

    BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
    round = process.env.SALT || 10

    /**
     * @route /api/v1/reset/password
     * password reset request
     * @param request 
     * @param response 
     */
    reset(request: Request, response: Response) {
        if(!this.validate(request, response)) return;

        User.findOne({ email : request.body.email }, (err : any, user : any) => {
            if (err) return response.status(500).send({message: err.message})
            if (!user) return response.status(404).json({message : 'User does not exists'})

            user.token = bcryptjs.hashSync((new Date).getTime().toString())
            user.save()

            Mailjet.subject('Password Reset Email')
            Mailjet.send(
                {
                    Email : user.email,
                    Name : user.first_name
                },
                `<p>Dear ${user.first_name}, <br/></p>
                <p>To reset your password click the link below:<br/></p>
                <p><a href="${ this.BASE_URL }/password/reset?token=${user.token}">Reset password</a><br/></p>
                <p>If you did not request a password reset from Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${ this.BASE_URL }">${ this.BASE_URL }</a> <br/>
                The Drive to Develop</p>`

            ).then(function (info) {
                response.json({})
            }, function (err : any) {
                response.status(500).json({ message : err.message })
            })

        })
    }

    /**
     * @route /api/v1/password/reset
     * change password on reset
     * @param request 
     * @param response 
     */
    resetPassword(request : Request, response : Response) {
        if(!this.validate(request, response)) {
            return;
        }
        const salt = bcryptjs.genSaltSync(Number(this.round))
        User.findOne({ token : request.body.token }, function(err : any, user : any) {
            if(err) 
                return response.status(500).send({ message : err.message })
            if(!user) 
                return response.status(404).send({ message : 'No reset password request found.' })
            // if(request.body.password !== request.body.password_confirmation) 
                // return response.status(422).send([{ msg : 'Password confirmation did not match password' }])

            user.password = bcryptjs.hashSync(request.body.password, salt)
            user.token = null
            user.save()
            response.json({message : 'success'})     
        })
    }
}