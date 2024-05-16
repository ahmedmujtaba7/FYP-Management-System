const mongoose = require('mongoose');
const panelSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    }],
    // Add other fields as needed
});
const Panel = mongoose.model('Panel', panelSchema);

module.exports = Panel;
