import express from 'express';
import multer from 'multer';
import path from 'path';
import { createTeacherForm, getTeacherForm, updateTeacherForm } from '../controllers/teacherFormController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: './src/public/teacher/', // Ensure this directory exists
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

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

// Teacher form routes
router.post('/create', upload.single('profilePicture'), createTeacherForm);
router.get('/:teacherformId', getTeacherForm);
router.put('/update-teacher/:id', upload.single('profilePicture'), updateTeacherForm);

export default router;
