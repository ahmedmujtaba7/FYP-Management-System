const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
        required: true
    },
    fyp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FYP', // Reference to the FYP model
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    },
    // Add other fields as needed
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
