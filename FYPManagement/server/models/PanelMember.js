const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const panelMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    panel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Panel' // Reference to the panel assigned to the panel member
    },
    // Add other fields as needed
});

// Hash password before saving to the database
panelMemberSchema.pre('save', async function(next) {
    const panelMember = this;
    if (!panelMember.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(panelMember.password, salt);
    panelMember.password = hashedPassword;
    next();
});

// Method to compare passwords
panelMemberSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const PanelMember = mongoose.model('PanelMember', panelMemberSchema);

module.exports = PanelMember;
