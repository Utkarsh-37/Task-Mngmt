const Task = require('../models/Task.model');

const createTask = async (taskData) => {
    return await Task.create(taskData);
};

const getTasks = async (user, filters) => {
    const query = {};

    // Role-based filtering: USER only sees tasks assigned to them or created by them
    if (user.role === 'USER') {
        query.$or = [{ assignedTo: user._id }, { createdBy: user._id }];
    }

    // Apply explicit filters
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.dueDate) query.dueDate = { $lte: new Date(filters.dueDate) };
    
    // Admin can filter by assigned user
    if (filters.assignedTo && user.role === 'ADMIN') {
        query.assignedTo = filters.assignedTo;
    }

    return await Task.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
};

const getTaskById = async (id, user) => {
    const task = await Task.findById(id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
        
    if (!task) throw new Error('Task not found');

    // Access control check for USER
    if (user.role === 'USER' && 
        String(task.assignedTo?._id) !== String(user._id) && 
        String(task.createdBy?._id) !== String(user._id)) {
        throw new Error('Not authorized to view this task');
    }

    return task;
};

const updateTask = async (id, updateData, user) => {
    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    if (user.role === 'USER') {
        throw new Error('Users are not allowed to edit full task details. Admins only.');
    }

    return await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteTask = async (id, user) => {
    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    if (user.role === 'USER') throw new Error('Not authorized to delete tasks');

    await task.deleteOne();
    return true;
};

const assignTask = async (taskId, assignedUserId) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    task.assignedTo = assignedUserId;
    await task.save();
    return task;
};

const updateTaskStatus = async (id, status, user) => {
    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    // Access control
    if (user.role === 'USER' && String(task.assignedTo) !== String(user._id)) {
        throw new Error('Not authorized to update status for a task not assigned to you');
    }

    task.status = status;
    await task.save();
    return task;
};

module.exports = {
    createTask, getTasks, getTaskById, updateTask, deleteTask, assignTask, updateTaskStatus
};