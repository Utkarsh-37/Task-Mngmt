const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console during development
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with ID of ${err.value}`;
        error = new Error(message);
        error.statusCode = 404;
    }

    // Mongoose duplicate key (e.g., duplicate email)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered. Please use another value.';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new Error(message);
        error.statusCode = 400;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new Error(message);
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new Error(message);
        error.statusCode = 401;
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;