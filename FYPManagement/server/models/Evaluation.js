const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PanelMember', // Reference to the PanelMember model
        required: true
    },
    fyp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FYP', // Reference to the FYP model
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    },
    // Add other fields as needed
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
