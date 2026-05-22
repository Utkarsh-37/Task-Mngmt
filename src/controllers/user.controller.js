const userService = require('../services/user.service');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

module.exports = { getUsers, getUserDetails };