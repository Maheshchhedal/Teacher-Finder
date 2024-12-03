import mongoose from 'mongoose';

// Schema for education information
const educationInfoSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
});

// Schema for subjects offered
const subjectOfferedSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is positive
  },
});

// Updated schema for availability using time as strings
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String, // Format: "hh:mm AM/PM"
    required: true,
    validate: {
      validator: function(value) {
        // Validate the format using a regex
        return /^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/.test(value);
      },
      message: props => `${props.value} is not a valid start time! Use hh:mm AM/PM format.`,
    },
  },
  endTime: {
    type: String, // Format: "hh:mm AM/PM"
    required: true,
    validate: {
      validator: function(value) {
        // Validate the format using a regex
        return /^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/.test(value);
      },
      message: props => `${props.value} is not a valid end time! Use hh:mm AM/PM format.`,
    },
  },
});

// Schema for location
const locationSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

// Main schema for the teacher form
const teacherFormSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensure unique phone numbers
  },
  aboutMe: {
    type: String,
    required: true,
  },
  educationInformation: {
    type: [educationInfoSchema],
    required: true,
  },
  subjectsOffered: {
    type: [subjectOfferedSchema],
    required: true,
  },
  generalAvailability: {
    type: [availabilitySchema],
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Add timestamps

// Create the TeacherForm model
const TeacherForm = mongoose.model('TeacherForm', teacherFormSchema);

export default TeacherForm;
