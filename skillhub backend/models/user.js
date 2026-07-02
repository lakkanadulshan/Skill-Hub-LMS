import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
    },
    
    phone: { type: String },

    address: { type: String, default: "" },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    avatar: { 
      type: String },
    
    bio: {
      type: String,
      default: "",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
