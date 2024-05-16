const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // Reference to the Student model for group members
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FYPSupervisor' // Reference to the FYPSupervisor model for the group's supervisor
    },
    // Add other fields as needed
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
