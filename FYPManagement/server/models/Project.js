const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadlines: {
        type: Date,
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FYPSupervisor', // Reference to the FYPSupervisor model
    },
    panel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Panel', // Reference to the Panel model
    },
    grade:{
        type: String,
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
