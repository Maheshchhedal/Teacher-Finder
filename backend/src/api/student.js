import express from 'express';
import multer from 'multer';
import path from 'path';
import verifyToken from '../middleware/auth.js'; // Correct path to middleware
import { signUp, login, getStudentProfile, updateProfile } from '../controllers/studentController.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './src/public/uploads/', // Ensure this directory exists
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// File upload with validation for image types and size
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (jpeg, jpg, png) are allowed!'));
        }
    }
});

// Define routes
router.post('/signup', upload.single('profileImage'), signUp);
router.post('/login', login);
router.get('/profile', verifyToken, getStudentProfile); // Get student profile, protected by JWT
router.put('/update/:id', upload.single('profileImage'), verifyToken, updateProfile);

export default router;
