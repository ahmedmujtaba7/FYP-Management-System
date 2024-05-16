const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Document', 'Link', 'File'], // Example types, modify as needed
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommitteeMember' // Reference to the CommitteeMember model
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    // Add other fields as needed
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
