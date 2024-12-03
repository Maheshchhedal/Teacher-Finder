import express from 'express';
import { searchTeachers } from '../controllers/teacherSearchController.js';

const router = express.Router();

// Define the route for searching teachers
router.get('/search', searchTeachers);// Ensure this matches your request

export default router;
