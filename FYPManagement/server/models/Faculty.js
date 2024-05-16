const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Supervisor', 'Panel'], // Define roles for Supervisor and Panel
    },
    password: {
        type: String,
        required: true
    },
    // Add other fields as needed
});

// Hash the password before saving
FacultySchema.pre('save', async function (next) {
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
FacultySchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Faculty = mongoose.model('Faculty', FacultySchema); // Change model name to Faculty

module.exports = Faculty;
