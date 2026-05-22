const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);
    
    // Remove password from response
    user.password = undefined;

    return { user, token };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return { user, token };
};

module.exports = { registerUser, loginUser };