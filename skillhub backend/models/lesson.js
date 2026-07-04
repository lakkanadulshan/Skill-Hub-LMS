import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    content:{
        type:String,
        required:true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required:true
    },
    createdAt:{ 
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
resources: [
        {
            name: { type: String, required: true }, 
            url: { type: String, required: true },  
            type: { type: String, enum: ["link", "file"], default: "link" }
        }
    ],
    duration:{
        type:Number,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    }
})

export default mongoose.model("Lesson", lessonSchema);