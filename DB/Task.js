const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true]
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Task = mongoose.model('tasks', TaskSchema)

module.exports = Task