import { Request, Response } from "express";
import { User } from "../../../models/User";
import { Controller } from "../Kernel/Controller";
import {File} from '../../../models/File'
import mongoose from 'mongoose'

export class ApiUserController extends Controller {
    constructor() {
        super();
        this.middleware('Auth')
    }

    /**
     * @route /api/v1/users/all
     * Get all user from database
     * @param request 
     * @param response 
     */
    userAll(request : Request, response : Response) {
        User.find(function(err, users) {
            if(err) {
                return response.status(500).send({message : err.message})
            }
            response.send(users)
        })
    }

    /**
     * @route /api/v1/user/:id [PATCH]
     * Api update user
     * @param request 
     * @param response 
     */
    updateUser(request : Request, response : Response) {
        User.findById(request.params.id, function(err : any, user : any) {
            if(err) return response.status(500).json({message : err.message})
            if(!user) return response.status(404).json({message : 'User does not exists'})

            const data = [
                ['email', request.body.email],
                ['first_name', request.body.first_name],
                ['last_name', request.body.last_name],
            ].map(x => {
                if(x[1]) {
                    user[x[0]] = x[1]
                } 
            })
            user.save().then(() => response.json(user))
            .catch((err : any) => response.status(500).json({message : err.message}))
        })
    }

    /**
     * @route /api/v1/my/profile
     * profile details of logged in user
     * @param request 
     * @param response 
     */
    async myProfile(request : Request, response : Response) {
        const user = await User.findById(request.auth?.id())
                            .populate('profileImage')
                        
        response.json({data : user})
    }

    /**
     * @route /api/v1/user/updateProfilePicture
     * @method PATCH
     * api update profile picture of logged in user
     * @param request
     * @param response
     */
    async updateProfilePicture(request : Request, response : Response) {
        if (!request.file) return response.status(422).json({message : 'Please select a file'})
        
        const profileImage = new File({
            file_name : request.file.originalname,
            path : request.file.path,
            mimetype : request.file.mimetype,
            size : request.file.size,
            user : request.auth?.id()
        })
        
        await profileImage.save()
        User.findById(request.auth?.id(), function (err : any, user : any) {
            user.profileImage = profileImage._id
            user.save().then(() => response.json({message : 'Profile image successfully updated'}))
                .catch((err : any) => response.status(500).json({message : err.message}))
        })
    }
}