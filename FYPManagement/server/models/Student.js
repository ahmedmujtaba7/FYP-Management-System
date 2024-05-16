const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    projectTitle: {//add id 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
        
    },
    supervisor: {// add in projext table
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FYPSupervisor' // Reference to the FYPSupervisor model
    },
    groupMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // Reference to other students in the same group
    }],
    password: {
        type: String,
        required: true
    },
    // Add other fields as needed
});

// Hash the password before saving
studentSchema.pre('save', async function (next) {
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
studentSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
