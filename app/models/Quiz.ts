import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    title : { type : String, required : true},
    start : { type : Date, required : true},
    end : { type : Date, required : true},
    is_live : {type : Boolean, default : false},
    category : { type : mongoose.Types.ObjectId, ref : 'Category' },
    questions : [
        { type : mongoose.Types.ObjectId, ref : 'Question'}
    ],
    user : { type : mongoose.Types.ObjectId, ref : 'User' }
}, {
    timestamps : true
})

export const Quiz = mongoose.model('Quiz', QuizSchema)