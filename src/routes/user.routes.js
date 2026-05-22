const express = require('express');
const { getUsers, getUserDetails } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Only ADMIN can manage users
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUserDetails);

module.exports = router;