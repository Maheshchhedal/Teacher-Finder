import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import studentRoutes from './src/api/student.js';
import teacherRoutes from './src/api/teacher.js';
import adminRoutes from './src/api/admin.js';
import bookingRoutes from './src/api/booking.js';
import searchRoutes from './src/api/searchRoutes.js';
import teacherFormRoutes from './src/api/teacherFormRoutes.js'

// Add the booking routes

// Initialize environment variables
dotenv.config();

// Determine file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json({ limit: '10mb' })); // For JSON payloads with a limit of 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded payloads with a limit of 10MB

// CORS Middleware (Open CORS Policy)
app.use(cors({
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allows sending cookies with requests
}));

// Serve static files from 'src/public/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'src', 'public', 'uploads')));
app.use('/teacher', express.static(path.join(__dirname, 'src', 'public','teacher')));

// Route handlers
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/bookings', bookingRoutes);
app.use('/teachers', searchRoutes);
app.use('/teacher-form', teacherFormRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
