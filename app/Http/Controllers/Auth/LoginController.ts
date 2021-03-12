import { Controller } from "../Kernel/Controller";
import {Request, Response} from 'express'
import { User } from "../../../models/User";
import jsonwebtoken from "jsonwebtoken"
import bcrypt from 'bcryptjs'

export class LoginController extends Controller {
    app_key : string = process.env.APP_KEY || 'basantashubhu'
    tokenExpiry : string = process.env.TOKEN_EXPIRY || '1hr'
    algorithm : string = process.env.ENC || 'HS256'
    static REDIRECT_URL = '/'

    constructor() {
        super();
        this.middleware('Guest')
    }

    loginPage(request : Request, response : Response) {
        response.render('auth/login')
    }

    login(request : Request, response : Response) {
        User.findOne({ email : request.body.email }, (err : any, user : any) => {
            if(err) {
                return response.status(422).send({message: err.message})
            }
            if(!user || !bcrypt.compareSync(request.body.password, user.password)) {
                return response.status(404).send({message: 'Incorrect username or password. Please try again.'})
            }
            jsonwebtoken.sign({data : {id : user.id}}, this.app_key, {expiresIn : this.tokenExpiry}, function(err : any, token : any) {
                if(err) {
                    return response.status(500).send({message : err.message})
                }
                request.cookies.token = token
                response.send({ token })
            })
        })
    }
}