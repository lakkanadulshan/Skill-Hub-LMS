import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // 👈 ඔයාගේ වැඩ කරන සැබෑ Cloudinary Config එක මෙතනින් Import කරන්න!

// memoryStorage වෙනුවට ඔයාගේ පවතින cloudinary instance එක හරහා storage එක සෑදීම
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // 💡 දැනටමත් config වෙලා තියෙන නිසා credentials ප්‍රශ්න එන්නේ නැත
  params: {
    folder: "skillhub_courses",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const courseUpload = multer({ storage });

export default courseUpload;