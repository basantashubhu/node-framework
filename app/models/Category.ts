import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    category_name : {
        type : String,
        required : true,
        unique : true
    },
    image : { type : mongoose.Types.ObjectId, ref : 'File' },
    is_active : {
        type : Boolean,
        default : true
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
})

export const Category = mongoose.model('Category', CategorySchema)