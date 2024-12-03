import Student from '../model/studentSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, address } = req.body;
        const profileImage = req.file ? req.file.path : null;

        // Validate input fields
        if (!fullName || !email || !password || !confirmPassword || !address) {
            if (profileImage) {
                await fs.unlink(profileImage); // Use fs/promises to delete the file asynchronously
            }
            return res.status(400).json({ msg: 'Please fill all fields' });
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            if (profileImage) {
                await fs.unlink(profileImage); // Delete the file if password mismatch
            }
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if student already exists
        const existingStudent = await Student.findOne({ email: normalizedEmail });
        if (existingStudent) {
            if (profileImage) {
                await fs.unlink(profileImage); // Delete the file if email already exists
            }
            return res.status(409).json({ msg: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new student
        const student = new Student({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            address,
            profileImage
        });

        // Save the student
        await student.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id, email: normalizedEmail, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the cookie with the token
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send success response
        res.status(201).json({ msg: 'Student created successfully' });

    } catch (err) {
        console.error('Error:', err);

        // Ensure file cleanup on server error
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path);
        }

        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        // Check if student exists
        const student = await Student.findOne({ email: email.toLowerCase() });
        if (!student) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update the student's tokens array and set cookie
        student.tokens = student.tokens.concat({ token });
        await student.save();

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ token });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID not provided' });
        }

        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            fullName: student.fullName,
            email: student.email,
            address: student.address,
            profileImage: student.profileImage // Ensure this matches the field in the schema
        });
    } catch (err) {
        console.error('Error in getStudentProfile:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, address } = req.body;

        console.log('Received Update Request:', { id, body: req.body, file: req.file });

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Save the current profile image path
        const currentImage = student.profileImage;

        // Update student fields
        student.fullName = fullName || student.fullName;
        student.email = email || student.email;
        student.address = address || student.address;

        if (req.file) {
            console.log('File received:', req.file);

            // If there is a new file, delete the old image
            if (currentImage) {
                await fs.unlink(currentImage).catch(err => console.error('Error deleting old profile image:', err));
            }

            student.profileImage = req.file.path; // Update with the new image path
        }

        await student.save();

        console.log('Profile updated successfully');
        return res.status(200).json({ message: 'Profile updated successfully', student });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Failed to update profile', error });
    }
};




