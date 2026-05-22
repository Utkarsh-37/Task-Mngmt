const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false // Do not return password by default in queries
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER'
        }
    },
    {
        timestamps: true
    }
);

// Pre-save hook to hash password before saving to DB
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return; // Just return to exit the function
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No need to call next() here; Mongoose handles the async completion!
});
// Instance method to compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);