import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherForm', // Correct reference to 'TeacherForm'
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
      
    },
    startTime: {
        type: String, // e.g., "10:00 AM"
        required: true,
    },
    endTime: {
        type: String, // e.g., "1:00 PM"
        required: true,
       
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
