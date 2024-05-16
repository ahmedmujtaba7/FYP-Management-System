const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const fypSupervisorSchema = new mongoose.Schema({
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
        unique: true
    },
    maxFYPs: {
        type: Number,
        default: 0
    },
    // Add other fields as needed
});

// Hash password before saving to the database


const FYPSupervisor = mongoose.model('FYPSupervisor', fypSupervisorSchema);

module.exports = FYPSupervisor;
