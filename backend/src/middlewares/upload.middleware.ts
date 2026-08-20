import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads/profile-pictures");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${req.user.user_id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
    }
};

export const uploadProfilePicture = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("profile_picture"); 