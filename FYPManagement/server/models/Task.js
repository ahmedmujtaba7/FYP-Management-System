const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // Reference to the Student model
    },
    completed: {
        type: Boolean,
        default: false
    },
    // Add other fields as needed
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
