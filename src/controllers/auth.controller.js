const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { user, token } = await authService.registerUser(req.body);
        res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);
        res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Profile fetched', data: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { register, login, getProfile };