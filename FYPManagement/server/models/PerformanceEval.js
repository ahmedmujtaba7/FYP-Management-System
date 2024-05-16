const mongoose = require('mongoose');

const performanceEvaluationSchema = new mongoose.Schema({
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PanelMember', // Reference to the PanelMember model
        required: true
    },
    evaluatee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
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
        type: String,
        required: true
    },
    evaluationDate: {
        type: Date,
        default: Date.now
    }
    // Add other fields as needed
});

const PerformanceEvaluation = mongoose.model('PerformanceEvaluation', performanceEvaluationSchema);

module.exports = PerformanceEvaluation;
