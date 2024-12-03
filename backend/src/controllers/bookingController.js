import Booking from '../model/bookingSchema.js';
import TeacherForm from '../model/teacherFormSchema.js';
import mongoose from 'mongoose'; // If you're using ES6 modules




export const bookTeacher = async (req, res) => {
    const { teacherId, startDate, endDate, startTime, endTime } = req.body;
    const studentId = req.user.id;

    try {
        const teacher = await TeacherForm.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found.' });
        }

        const convertTo24Hour = (time) => {
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);

            if (modifier === 'PM' && hours < 12) {
                hours += 12;
            } else if (modifier === 'AM' && hours === 12) {
                hours = 0;
            }

            return { hours, minutes };
        };

        // Helper function to convert time to 12-hour format
        const convertTo12HourFormat = (time) => {
            const [hour, minute] = time.split(':').map(Number);
            const suffix = hour >= 12 ? 'PM' : 'AM';
            const convertedHour = hour % 12 || 12; // Convert to 12-hour format
            return `${String(convertedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
        };

        const { hours: startHours, minutes: startMinutes } = convertTo24Hour(startTime);
        const { hours: endHours, minutes: endMinutes } = convertTo24Hour(endTime);

        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHours, startMinutes);

        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHours, endMinutes);

        const existingBooking = await Booking.findOne({
            teacherId,
            studentId,
            $or: [
                {
                    $and: [
                        { startDate: { $lte: endDateTime }, endDate: { $gte: startDateTime } },
                        { startTime: { $lte: endDateTime }, endTime: { $gte: startDateTime } }
                    ]
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'You have already booked this teacher for the selected time.' });
        }

        const newBooking = new Booking({
            teacherId,
            studentId,
            startDate: startDateTime,
            endDate: endDateTime,
            startTime: convertTo12HourFormat(startTime),  // Store in 12-hour format
            endTime: convertTo12HourFormat(endTime),      // Store in 12-hour format
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking request sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
};

export const checkBooking = async (req, res) => {
    const { teacherId } = req.query;
    const studentId = req.user.id;

    try {
        const existingBooking = await Booking.findOne({ teacherId, studentId });
        if (existingBooking) {
            return res.json({ success: true, isBooked: true });
        }
        return res.json({ success: true, isBooked: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while checking bookings.' });
    }
};

// Get all bookings for a student
export const getStudentBookings = async (req, res) => {
    const studentId = req.user.id;

    try {
        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID is missing' });
        }

        const bookings = await Booking.find({ studentId })
            .populate({
                path: 'teacherId',
                model: 'TeacherForm',
                select: 'fullname phoneNumber degree level profilePicture subjectsOffered', // Combined population
            });

        console.log('Fetched Bookings:', bookings);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found for this student.' });
        }

        const convertTo12HourFormat = (dateTime) => {
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            return new Date(dateTime).toLocaleTimeString([], options);
        };

        const formattedBookings = bookings.map(booking => {
            console.log('Booking:', booking);

            const formattedDate = new Date(booking.startDate).toLocaleDateString();
            const startTime = convertTo12HourFormat(booking.startDate);
            const endTime = convertTo12HourFormat(booking.endDate);

            return {
                _id: booking._id,
                date: formattedDate,
                startTime,
                endTime,
                status: booking.status,
                teacher: {
                    fullName: booking.teacherId?.fullname || 'Unknown Teacher',
                    phoneNumber: booking.teacherId?.phoneNumber || 'N/A',
                    degree: booking.teacherId?.degree || 'N/A',
                    profilePicture: booking.teacherId?.profilePicture || '',
                },
                subjectsOffered: booking.teacherId?.subjectsOffered.map(subject => ({
                    level: subject.level,
                    subject: subject.subject,
                    price: subject.price,
                })) || [],
                startDate: booking.startDate, // Include the start date
                endDate: booking.endDate,     // Include the end date
            };
        });

        return res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error('Error fetching student bookings:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};







// Get Teacher Bookings
export const getTeacherBookings = async (req, res) => {
    const teacherId = req.user?.id;

    if (!teacherId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Teacher ID is missing.' });
    }

    try {
        const bookings = await Booking.find({ teacherId: new mongoose.Types.ObjectId(teacherId) })
            .populate({
                path: 'studentId',
                select: 'fullname email address',
            })
            .populate({
                path: 'teacherId',
                model: 'TeacherForm',
                select: 'subjectsOffered',
            });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found for this teacher.' });
        }

        const formattedBookings = bookings.map(booking => ({
            _id: booking._id,
            startDate: booking.startDate.toLocaleDateString(),
            endDate: booking.endDate.toLocaleDateString(),
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status,
            student: {
                fullname: booking.studentId?.fullname || 'Unknown Student',
                email: booking.studentId?.email || 'Unknown Email',
                address: booking.studentId?.address || 'Unknown Address',
            },
            subjectsOffered: booking.teacherId?.subjectsOffered.map(subject => ({
                level: subject.level,
                subject: subject.subject,
                price: subject.price,
            })) || [],
        }));

        return res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error('Error fetching teacher bookings:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Accept a booking
export const acceptBooking = async (req, res) => {
    const { bookingId } = req.params;
    const teacherId = req.user?.id; 

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.teacherId.toString() !== teacherId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to accept this booking' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending bookings can be accepted' });
        }

        booking.status = 'confirmed';
        await booking.save();

        return res.status(200).json({ success: true, message: 'Booking confirmed', booking });
    } catch (error) {
        console.error('Error accepting booking:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Reject a booking
export const rejectBooking = async (req, res) => {
    const { bookingId } = req.params;
    const teacherId = req.user?.id; 

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.teacherId.toString() !== teacherId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to reject this booking' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending bookings can be rejected' });
        }

        booking.status = 'canceled';
        await booking.save();

        return res.status(200).json({ success: true, message: 'Booking canceled', booking });
    } catch (error) {
        console.error('Error rejecting booking:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
