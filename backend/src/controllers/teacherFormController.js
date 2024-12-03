
import mongoose from 'mongoose';
import fs from 'fs/promises'; // Importing fs with promises
import { validationResult } from 'express-validator'; // Ensure express-validator is imported
import  TeacherForm from '../model/teacherFormSchema.js'; // Adjust this import based on your file structure


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
                typeof item === 'string' ? item.toLowerCase() : item
            ) : [];

        const lowerCaseSubjectsOffered = subjectsOffered ? 
            JSON.parse(subjectsOffered).map(item => 
                typeof item === 'string' ? item.toLowerCase() : item
            ) : [];

        // Process generalAvailability to ensure it's in the 12-hour format with AM/PM
        const lowerCaseGeneralAvailability = generalAvailability ? 
            JSON.parse(generalAvailability).map(item => {
                const { day, startTime, endTime } = item;
                return {
                    day,
                    startTime: convertTo12HourFormat(startTime),
                    endTime: convertTo12HourFormat(endTime)
                };
            }) : [];

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

// Helper function to convert time to 12-hour format
const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const convertedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${String(convertedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
};

export const getTeacherForm = async (req, res) => {
    try {
        const { teacherformId } = req.params;
        console.log('Received teacherformId:', teacherformId);

        if (!mongoose.Types.ObjectId.isValid(teacherformId)) {
            console.error('Invalid ObjectId:', teacherformId);
            return res.status(400).json({ message: 'Invalid teacher form ID format' });
        }

        const teacherDetail = await TeacherForm.findById(teacherformId);
        if (!teacherDetail) {
            return res.status(404).json({ message: 'Teacher detail not found' });
        }

        res.status(200).json({
            id: teacherDetail._id,
            fullname: teacherDetail.fullname,
            location: teacherDetail.location,
            degree: teacherDetail.degree,
            phoneNumber: teacherDetail.phoneNumber,
            aboutMe: teacherDetail.aboutMe,
            subjectsOffered: teacherDetail.subjectsOffered,
            generalAvailability: teacherDetail.generalAvailability,
            profilePicture: teacherDetail.profilePicture,
        });
    } catch (error) {
        console.error('Error fetching teacher detail:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};





export const updateTeacherForm = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
            }
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params; // Assuming you're passing the teacher ID in the URL
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
                typeof item === 'string' ? item.toLowerCase() : item
            ) : [];

        const lowerCaseSubjectsOffered = subjectsOffered ?
            JSON.parse(subjectsOffered).map(item =>
                typeof item === 'string' ? item.toLowerCase() : item
            ) : [];

        const lowerCaseGeneralAvailability = generalAvailability ?
            JSON.parse(generalAvailability).map(item =>
                typeof item === 'string' ? item.toLowerCase() : item
            ) : [];

        // Validate that arrays are formatted correctly
        if (!Array.isArray(lowerCaseEducationInformation) ||
            !Array.isArray(lowerCaseSubjectsOffered) ||
            !Array.isArray(lowerCaseGeneralAvailability)) {
            return res.status(400).json({ message: 'Invalid format for educationInformation, subjectsOffered, or generalAvailability' });
        }

        // Find the existing teacher form document
        const existingTeacherForm = await TeacherForm.findById(id);
        if (!existingTeacherForm) {
            return res.status(404).json({ message: 'Teacher form not found' });
        }

        // Update fields
        existingTeacherForm.fullname = lowerCaseFullname;
        existingTeacherForm.degree = lowerCaseDegree;
        existingTeacherForm.phoneNumber = lowerCasePhoneNumber;
        existingTeacherForm.aboutMe = lowerCaseAboutMe;
        existingTeacherForm.educationInformation = lowerCaseEducationInformation;
        existingTeacherForm.subjectsOffered = lowerCaseSubjectsOffered;
        existingTeacherForm.generalAvailability = lowerCaseGeneralAvailability;
        existingTeacherForm.location = {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude)
        };

        // Handle profile picture update
        if (req.file) {
            // If there's an existing profile picture, delete it (if necessary)
            if (existingTeacherForm.profilePicture) {
                const oldPath = `public/uploads/${existingTeacherForm.profilePicture}`; // Adjust the path as necessary
                await fs.unlink(oldPath).catch(err => console.error('Error deleting old profile picture:', err));
            }
            existingTeacherForm.profilePicture = req.file.filename;
        }

        // Save the updated teacher form document
        const updatedTeacherForm = await existingTeacherForm.save();
        console.log('Teacher form updated successfully:', updatedTeacherForm);

        return res.status(200).json({ message: 'Teacher detail updated successfully', updatedTeacherForm });
    } catch (error) {
        console.error('Detailed error in updateTeacherForm:', error);

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