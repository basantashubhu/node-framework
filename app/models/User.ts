import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        },
        gender : String,
        email : {
            type : String,
            required : true,
            unique : true
        },
        userType : {
            type : String,
            enum : ['admin', 'user'],
            required : true,
            default : 'user'
        },
        password : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : false
        },
        code : {
            type : Number,
            required : false
        },
        verifiedAt : {
            type : Date,
            required : false
        },
        profileImage : {
            type : mongoose.Types.ObjectId,
            ref : 'File',
        }
    }, 
    {
        timestamps : true,
    }
);

export const User = mongoose.model('User', UserSchema)