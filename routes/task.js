const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middlewares/authMiddleware')

router.route('/')
    .get(requireAuth, taskController.getTasks)
    .post(requireAuth, taskController.createTask);
router.route('/userlist')
    .get(requireAuth, taskController.getUserList);
router.route('/user')
    .get(requireAuth, taskController.getTasksForUser);
router.route('/updateStatus/:status')
    .put(requireAuth, taskController.updateStatus);
router.route('/:id')
    .get(requireAuth, taskController.getTask)
    .put(requireAuth, taskController.updateTask)
    .delete(requireAuth, taskController.deleteTask);
    
module.exports = router;