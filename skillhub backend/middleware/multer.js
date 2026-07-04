// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({
//     storage,
// });

// export default upload;
import multer from "multer";
import path from "path";
import fs from "fs";

// Upload කරන ෆෝල්ඩර් එක නැත්නම් හදනවා
const uploadDir = 'uploads/materials/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // file name එක unique කරන්න timestamp එකක් එකතු කරනවා
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export default upload;