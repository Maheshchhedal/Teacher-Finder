import express from 'express';
import { 
    bookTeacher, 
    checkBooking,
    acceptBooking, 
    rejectBooking, 
    getStudentBookings, 
    getTeacherBookings 
} from '../controllers/bookingController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Booking routes
router.post('/book', verifyToken, bookTeacher);
router.get('/check', verifyToken, checkBooking);
router.get('/student', verifyToken, getStudentBookings); // Get all bookings for a student

router.get('/teacher', verifyToken, getTeacherBookings);
router.put('/accept/:bookingId', verifyToken, acceptBooking);
router.put('/reject/:bookingId', verifyToken, rejectBooking);


export default router;
