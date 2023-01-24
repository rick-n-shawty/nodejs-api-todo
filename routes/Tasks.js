const express = require('express')
const router = express.Router()
const {
    getAllTasks,
    getOneTask,
    deleteTask,
    updateTask,
    createTask,
} = require('../Controllers/Task')


router.route('/tasks').get(getAllTasks).post(createTask)
router.route('/tasks/:id').patch(updateTask).get(getOneTask).delete(deleteTask)
module.exports = router