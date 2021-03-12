import mongoose from 'mongoose'

export const ResetEmail = mongoose.model('ResetEmail', new mongoose.Schema({
    messageId : String,
    messageUrl : String,
}, {
    timestamps : true
}))