import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    category:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String
    }
})

export default mongoose.models.Course || mongoose.model("Course", courseSchema);