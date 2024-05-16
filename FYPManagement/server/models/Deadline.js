const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadlineDateTime: {
        type: Date,
        required: true
    },
    // Add other fields as needed
});

const Deadline = mongoose.model('Deadline', deadlineSchema);

module.exports = Deadline;
