import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    file_name : String,
    path : String,
    mimetype : String,
    size : Number,
    user : { type : mongoose.Types.ObjectId, ref : 'User' }
}, {
    timestamps : true
})

export const File = mongoose.model('File', FileSchema)