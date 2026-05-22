const taskService = require('../services/task.service');

const createTask = async (req, res) => {
    try {
        const taskData = { ...req.body, createdBy: req.user._id };
        const task = await taskService.createTask(taskData);
        res.status(201).json({ success: true, message: 'Task created successfully', data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            assignedTo: req.query.assignedTo,
            dueDate: req.query.dueDate
        };
        const tasks = await taskService.getTasks(req.user, filters);
        res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Task fetched successfully', data: task });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body, req.user);
        res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Task deleted successfully', data: {} });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

const assignTask = async (req, res) => {
    try {
        const task = await taskService.assignTask(req.params.id, req.body.userId);
        res.status(200).json({ success: true, message: 'Task assigned successfully', data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const task = await taskService.updateTaskStatus(req.params.id, req.body.status, req.user);
        res.status(200).json({ success: true, message: 'Task status updated successfully', data: task });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus
};