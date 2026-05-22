const { body, param } = require('express-validator');

const createTaskValidation = [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('description').optional().isString(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required (ISO8601 format)'),
    body('assignedTo').optional().isMongoId().withMessage('Invalid User ID for assignment')
];

const updateTaskValidation = [
    param('id').isMongoId().withMessage('Invalid Task ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
    body('description').optional().isString(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required')
];

const assignTaskValidation = [
    param('id').isMongoId().withMessage('Invalid Task ID'),
    body('userId').isMongoId().withMessage('Valid User ID is required to assign task')
];

const updateTaskStatusValidation = [
    param('id').isMongoId().withMessage('Invalid Task ID'),
    body('status').isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status')
];

module.exports = {
    createTaskValidation,
    updateTaskValidation,
    assignTaskValidation,
    updateTaskStatusValidation
};