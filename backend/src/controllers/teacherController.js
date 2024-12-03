import Teacher from '../model/teacherSchema.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs/promises'; // Importing fs with promises
import { validationResult } from 'express-validator'; // Ensure express-validator is imported
import  TeacherForm from '../model/teacherFormSchema.js'; // Adjust this import based on your file structure



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

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email: normalizedEmail });
        if (existingTeacher) {
            if (profileImage) {
                await fs.unlink(profileImage); // Delete the file if email already exists
            }
            return res.status(409).json({ msg: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new teacher
        const teacher = new Teacher({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            address,
            profileImage
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: teacher._id, email: normalizedEmail, role: 'teacher' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Save the token in the teacher document and set the cookie
        teacher.tokens = teacher.tokens.concat({ token });
        await teacher.save();

        // Set the cookie with the token
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send success response
        res.status(201).json({ msg: 'Teacher created successfully' });

    } catch (err) {
        console.error('Error:', err);

        // Ensure file cleanup on server error
        if (req.file) {
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
        // Check if teacher exists
        const teacher = await Teacher.findOne({ email: email.toLowerCase() });
        if (!teacher) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: teacher._id, email: teacher.email, role: 'teacher' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update the teacher's tokens array and set cookie
        teacher.tokens = teacher.tokens.concat({ token });
        await teacher.save();

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ token });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const getTeacherProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID not provided' });
        }

        const teacher = await Teacher.findById(userId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({
            fullName: teacher.fullName,
            email: teacher.email,
            address: teacher.address,
            profileImage: teacher.profileImage
        });
    } catch (err) {
        console.error('Error in getTeacherProfile:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, address } = req.body;

        console.log('Received Update Request:', { id, body: req.body, file: req.file });

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Save the current profile image path
        const currentImage = teacher.profileImage;

        // Update teacher fields
        teacher.fullName = fullName || teacher.fullName;
        teacher.email = email || teacher.email;
        teacher.address = address || teacher.address;

        if (req.file) {
            console.log('File received:', req.file);

            // If there is a new file, delete the old image
            if (currentImage) {
                await fs.unlink(currentImage).catch(err => console.error('Error deleting old profile image:', err));
            }

            teacher.profileImage = req.file.path; // Update with the new image path
        }

        await teacher.save();

        console.log('Profile updated successfully');
        return res.status(200).json({ message: 'Profile updated successfully', teacher });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Failed to update profile', error });
    }
};

export const createTeacherForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
            }
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            fullname,
            degree,
            phoneNumber,
            aboutMe,
            educationInformation,
            subjectsOffered,
            generalAvailability,
            latitude,
            longitude
        } = req.body;

        // Validate required fields
        if (!fullname || !degree || !phoneNumber || !aboutMe || !latitude || !longitude) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Convert fields to lowercase
        const lowerCaseFullname = fullname.toLowerCase();
        const lowerCaseDegree = degree.toLowerCase();
        const lowerCasePhoneNumber = phoneNumber.toLowerCase();
        const lowerCaseAboutMe = aboutMe.toLowerCase();

        // Parse and convert array fields to lowercase
        const lowerCaseEducationInformation = educationInformation ? 
            JSON.parse(educationInformation).map(item => 
                typeof item === 'string' ? item.toLowerCase() : item // Keep the item unchanged if it's not a string
            ) : [];

        const lowerCaseSubjectsOffered = subjectsOffered ? 
            JSON.parse(subjectsOffered).map(item => 
                typeof item === 'string' ? item.toLowerCase() : item // Keep the item unchanged if it's not a string
            ) : [];

        const lowerCaseGeneralAvailability = generalAvailability ? 
            JSON.parse(generalAvailability).map(item => 
                typeof item === 'string' ? item.toLowerCase() : item // Keep the item unchanged if it's not a string
            ) : [];

        // Validate that arrays are formatted correctly
        if (!Array.isArray(lowerCaseEducationInformation) || 
            !Array.isArray(lowerCaseSubjectsOffered) || 
            !Array.isArray(lowerCaseGeneralAvailability)) {
            return res.status(400).json({ message: 'Invalid format for educationInformation, subjectsOffered, or generalAvailability' });
        }

        // Create new teacher form document
        const newTeacherForm = new TeacherForm({
            fullname: lowerCaseFullname,
            degree: lowerCaseDegree,
            phoneNumber: lowerCasePhoneNumber,
            aboutMe: lowerCaseAboutMe,
            educationInformation: lowerCaseEducationInformation,
            subjectsOffered: lowerCaseSubjectsOffered,
            generalAvailability: lowerCaseGeneralAvailability,
            location: {
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            },
            profilePicture: req.file ? req.file.filename : undefined // Handle file upload
        });

        // Save the teacher form document
        const savedTeacherForm = await newTeacherForm.save();
        console.log('Teacher form saved successfully:', savedTeacherForm);

        return res.status(201).json({ message: 'Teacher detail created successfully', newTeacherForm: savedTeacherForm });
    } catch (error) {
        console.error('Detailed error in createTeacherForm:', error);

        // Delete uploaded file if an error occurs
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }

        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTeacherForm = async (req, res) => {
    try {
        const { teacherId } = req.params;
        console.log('Received teacherId:', teacherId); // Log the received teacherId
        
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            console.error('Invalid ObjectId:', teacherId); // Log if ObjectId is invalid
            return res.status(400).json({ message: 'Invalid teacher ID format' });
        }
        
        const teacherDetail = await TeacherForm.findById(teacherId);
        console.log('Fetched teacherDetail:', teacherDetail); // Log the fetched detail
        
        if (!teacherDetail) {
            console.error('Teacher detail not found for ID:', teacherId); // Log if detail is not found
            return res.status(404).json({ message: 'Teacher detail not found' });
        }

        res.status(200).json({
            id: teacherDetail._id,
            fullname: teacherDetail.fullname,
            location: teacherDetail.location,
            degree: teacherDetail.degree,
            phoneNumber: teacherDetail.phoneNumber,
            aboutMe: teacherDetail.aboutMe,
            educationInformation: teacherDetail.educationInformation,
            subjectsOffered: teacherDetail.subjectsOffered,
            generalAvailability: teacherDetail.generalAvailability,
            profilePicture: teacherDetail.profilePicture,
        });
    } catch (error) {
        console.error('Error fetching teacher detail:', error); // Log the error
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const updateTeacherForm = async (req, res) => {
    try {
        // Validate form data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract teacher ID from parameters
        const { id } = req.params;

        // Find the existing teacher detail
        const teacherDetail = await TeacherDetail.findById(id);
        if (!teacherDetail) {
            return res.status(404).json({ message: 'Teacher detail not found' });
        }

        // Extract fields from the request body
        const {
            fullname,
            degree,
            phonenumber,
            aboutme,
            educationInformation,
            subjectsOffered,
            generalAvailability,
            location // Expected to contain latitude and longitude
        } = req.body;

        // Extract profile picture file path if available
        const profilePicture = req.file ? req.file.filename : undefined;

        // Parse the JSON fields back to arrays/objects
        const parsedEducationInformation = educationInformation ? JSON.parse(educationInformation) : [];
        const parsedSubjectsOffered = subjectsOffered ? JSON.parse(subjectsOffered) : [];
        const parsedGeneralAvailability = generalAvailability ? JSON.parse(generalAvailability) : [];
        
        // Parse location if available and ensure latitude and longitude are included
        let parsedLocation = {};
        if (location) {
            parsedLocation = JSON.parse(location);
            if (parsedLocation.latitude === undefined || parsedLocation.longitude === undefined) {
                return res.status(400).json({ message: 'Latitude and longitude are required in location' });
            }
        }

        // Update fields
        teacherDetail.fullname = fullname || teacherDetail.fullname;
        teacherDetail.degree = degree || teacherDetail.degree;
        teacherDetail.phonenumber = phonenumber || teacherDetail.phonenumber;
        teacherDetail.aboutme = aboutme || teacherDetail.aboutme;
        teacherDetail.educationInformation = parsedEducationInformation;
        teacherDetail.subjectsOffered = parsedSubjectsOffered;
        teacherDetail.generalAvailability = parsedGeneralAvailability;

        // Update location if provided
        if (parsedLocation.latitude && parsedLocation.longitude) {
            teacherDetail.location = {
                latitude: parsedLocation.latitude,
                longitude: parsedLocation.longitude,
            };
        }

        // Update profile picture if provided
        if (profilePicture) {
            // Remove old profile picture if a new one is being uploaded
            if (teacherDetail.profilePicture) {
                await fs.promises.unlink(`public/uploads/${teacherDetail.profilePicture}`).catch(err => console.error('Error deleting old file:', err));
            }
            teacherDetail.profilePicture = profilePicture;
        }

        // Save the updated teacher detail
        await teacherDetail.save();

        res.status(200).json({
            message: 'Teacher detail updated successfully',
            teacherDetail
        });
    } catch (error) {
        console.error('Error updating teacher detail:', error);
        // Handle file cleanup if needed
        if (req.file) {
            await fs.promises.unlink(req.file.path).catch(err => console.error('Error deleting file:', err));
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
