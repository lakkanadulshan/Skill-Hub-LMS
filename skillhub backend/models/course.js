import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    

    
    price: { 
        type: Number, 
        default: 0 
    },
    duration: { 
        type: String, 
        default: "Self-paced" 
    },
    level: {
        type: String, 
        default: "All Levels" 
    },
    whatYouWillLearn: {
        type: [String], 
        default: []
    },
    resourcesCount: {
        type: Number, 
        default: 0 
    },
    hasCertificate: {
        type: Boolean, 
        default: true 
    },

   

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Course || mongoose.model("Course", courseSchema);