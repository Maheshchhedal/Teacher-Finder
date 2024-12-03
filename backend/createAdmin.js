// createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './src/model/adminSchema.js';  // Adjust path if necessary
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Password to hash
        const plainTextPassword = 'admin@1';

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

        // Create admin instance
        const admin = new Admin({
            email: 'admin@gmail.com',
            password: hashedPassword
        });

        // Save admin to database
        await admin.save();
        console.log('Admin created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
};

createAdmin();
