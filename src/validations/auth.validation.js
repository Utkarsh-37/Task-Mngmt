const { body } = require('express-validator');

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['ADMIN', 'USER']).withMessage('Invalid role specified')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
    registerValidation,
    loginValidation
};