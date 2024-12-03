import mongoose from 'mongoose';
import '../database/connection.js'; 
const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'teacher'
    },
    profileImage: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});


const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
