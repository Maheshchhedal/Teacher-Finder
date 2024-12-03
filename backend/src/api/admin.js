import express from 'express';
import { login, getAdminProfile,getAllStudents,
     deleteStudent, getAllTeachers, deleteTeacher } from '../controllers/adminController.js';

const router = express.Router();


router.post('/login', login);

router.get('/admin/profile', getAdminProfile);

router.get('/students', getAllStudents);


router.delete('/students/:id', deleteStudent);


router.get('/teachers', getAllTeachers);


router.delete('/teachers/:id', deleteTeacher);


export default router;
