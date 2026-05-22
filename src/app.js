const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

// Error Handler Import
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Global Middleware
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Management API is running',
        data: {}
    });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Route handler
app.use((req, res, next) => {
    const error = new Error(`Endpoint not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

module.exports = app;