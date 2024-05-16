const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const committeeMemberSchema = new mongoose.Schema({
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
    // Add other fields as needed
});

// Hash the password before saving
committeeMemberSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords
committeeMemberSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const CommitteeMember = mongoose.model('CommitteeMember', committeeMemberSchema);

module.exports = CommitteeMember;
