const User = require('../models/User.model');

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = { getAllUsers, getUserById };