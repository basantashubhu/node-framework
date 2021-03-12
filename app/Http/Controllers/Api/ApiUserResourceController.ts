import { Controller } from "../Kernel/Controller"
import { Request, Response } from 'express'
import { User } from '../../../models/User'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer, { SentMessageInfo } from 'nodemailer'
import Transporter from '../../../Mail/Transporter'
import { ResetEmail } from "../../../models/ResetEmail"
import mailjet from 'node-mailjet'
import Mailjet from "../../../Mail/Mailjet"

export class ApiUserResourceController extends Controller {

    app_key = process.env.APP_KEY || 'basantashubhu'
    BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

    /**
     * @route /api/v1/user/register
     * api user registration
     * @param request 
     * @param response 
     */
    register(request: Request, response: Response) {
        if (!this.validate(request, response)) {
            return;
        }

        const salt = bcrypt.genSaltSync(Number(process.env.SALT || 10))

        const newUser = new User({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, salt)
        })
        newUser.save().then((user: any) => {

            const code = Math.floor(1000 + Math.random() * 9000)
            user.code = 1234 || code
            user.save()

            if (process.env.NODE_ENV === 'development') {
                return response.status(201).json({data : user})
            }

            Mailjet.subject('Please confirm your email address')
            Mailjet.send(
                {
                    Name : user.first_name,
                    Email : user.email
                },
                `<p>Dear ${ user.first_name }, <br/></p>
                <p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                <p>Please take a second to make sure we have your correct email address. <br/></p>
                <p><a href="${this.BASE_URL}/email/confirm?email=${user.email}&code=${code}"><strong>Confirm your email address</strong></a><br/></p>
                <p>Or try this code,</p>
                <p>Code : ${code} <br/></p>
                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                The Drive to Develop</p>`
            ).then((result) => {
                // console.log(result.body)
                response.status(201).json({data : user})
            })
            .catch((err) => {
                // console.log(err.statusCode)
                response.status(500).json({message : err.message})
            })

        }).catch(function (err) {
            response.status(500).json({ message: err.message })
        })
    }

    /**
     * @router /api/v1/user/authenticate
     * api user authentication
     * @param request 
     * @param response 
     */
    authenticate(request: Request, response: Response) {
        if (!this.validate(request, response)) {
            return
        }
        const expiresIn = process.env.TOKEN_EXPIRY || '1hr'

        User.findOne({ email: request.body.email }, (err: any, user: any) => {
            if (err) return response.status(500).json({message: err.message})
            if (!bcrypt.compareSync(request.body.password, user.password))
                return response.status(422).json({errors: {email: 'Invalid email address or password'}})
            if(!user.verifiedAt) return response.status(403).json({message: 'Email is not verified'})

            jsonwebtoken.sign({ data: { id: user.id } }, this.app_key, { expiresIn }, function (err: any, token: any) {
                if (err) return response.status(500).json({message: err.message})

                response.json({ token })
            })
        })
    }

    /**
     * @route /api/v1/token
     * Validate token from body
     * @param request 
     * @param response 
     */
    validateToken(request: Request, response: Response) {
        const expiresIn = process.env.TOKEN_EXPIRY || '1hr'
        jsonwebtoken.verify(request.body.token, this.app_key, (err: any, decoded: any) => {
            // Unauthorized
            if (err) return response.status(401).json({message: err.message})

            jsonwebtoken.sign(decoded, this.app_key, { expiresIn }, function (err: any, token: any) {
                if (err) return response.status(500).json({message: err.message})

                response.json({ token })
            })
        })
    }

    /**
     * @route /api/v1/email/confirm/:id
     * Verify the email address of newly registered user
     * @param request 
     * @param response 
     */
    veryEmail(request : Request, response : Response) {
        if(!this.validate(request, response)) return;

        User.findOne({
            email : request.query.email,
        }, function (err : any, user : any) {
            if (err)
                return response.status(500).json({message : err.message})
            if (!user) 
                return response.status(404).json({message : 'User does not exists'})
            if (Number(user.code) !== Number(request.query.code))
                return response.status(422).json({errors : {code : "Confirmation code did not match"}})
            
            if (!user.verifiedAt) {
                user.verifiedAt = new Date()
                user.save()
            }
            response.json({data : user})
        })
    }
}