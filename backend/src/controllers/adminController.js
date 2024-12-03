import Admin from '../model/adminSchema.js';  // Adjust path if necessary
import Student from '../model/studentSchema.js';  // Adjust path if necessary
import Teacher from '../model/teacherSchema.js';  // Adjust path if necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Admin login function
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            message: 'Login successful'
        });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred during login', error: err.message });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        // Get the token from the authorization header
        const token = req.headers.authorization.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the admin by email from the token
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        // Return the admin profile (excluding sensitive information)
        const { password, ...adminProfile } = admin.toObject(); // Exclude password
        res.json(adminProfile);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'An error occurred while fetching the profile', error: err.message });
    }
};

// Fetch all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();  // Fetch all students from the database
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err.message });
    }
};

// Delete a student by ID
export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Student.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully', result });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting student', error: err.message });
    }
};

// Fetch all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();  // Fetch all teachers from the database
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
};

// Delete a teacher by ID
export const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Teacher.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json({ message: 'Teacher deleted successfully', result });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting teacher', error: err.message });
    }
};


