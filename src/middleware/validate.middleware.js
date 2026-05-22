const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => err.msg);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: extractedErrors
        });
    }
    next();
};

module.exports = { validateRequest };