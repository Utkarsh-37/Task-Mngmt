const express = require('express');
const {
    createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus
} = require('../controllers/task.controller');
const {
    createTaskValidation, updateTaskValidation, assignTaskValidation, updateTaskStatusValidation
} = require('../validations/task.validation');
const { validateRequest } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect); // All task routes require authentication

router.post('/', authorize('ADMIN'), createTaskValidation, validateRequest, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', authorize('ADMIN'), updateTaskValidation, validateRequest, updateTask);
router.delete('/:id', authorize('ADMIN'), deleteTask);

// Specific actions
router.patch('/:id/assign', authorize('ADMIN'), assignTaskValidation, validateRequest, assignTask);
router.patch('/:id/status', updateTaskStatusValidation, validateRequest, updateTaskStatus);

module.exports = router;