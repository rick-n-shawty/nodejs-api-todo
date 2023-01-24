const Task = require('../DB/Task')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const getAllTasks = async (req, res) =>{
    const userId = req.userId
    const tasks = await Task.find({createdBy: userId})
    const comepletedTasks = await Task.find({isCompleted: true, createdBy: userId})
    res.status(StatusCodes.OK).json({msg: `all tasks for user ${userId}`, tasks, comepletedTasks})
}
const createTask = async (req, res) =>{
    const {title} = req.body
    const userId = req.userId
    const task = await Task.create({createdBy: userId, title})
    const tasks = await Task.find({createdBy: userId})
    res.status(StatusCodes.CREATED).json({msg: 'task has been created!', tasks})
}

const getOneTask = async (req, res) =>{
    const taskId = req.params.id 
    const userId = req.userId
    const task = await Task.findOne({createdBy: userId, _id: taskId})
    res.status(StatusCodes.OK).json({msg: `this is task of user ${userId}`, task})
}

const updateTask = async (req, res) =>{
    const taskId = req.params.id
    const userId = req.userId
    const task = await Task.findOneAndUpdate({createdBy: userId, _id: taskId}, req.body)
    res.status(StatusCodes.ACCEPTED).json({msg: 'you updated your task!', task})
}

const deleteTask = async (req, res) =>{
    const taskId = req.params.id 
    const userId = req.userId
    const task = await Task.findOneAndRemove({createdBy: userId, _id: taskId})
    const tasks = await Task.find({createdBy: userId})
    res.status(StatusCodes.ACCEPTED).json({msg: 'you deleted the task', tasks})
}
const checkAccessToken = async(req, res) =>{
    const {accessToken} = req.body
    jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET, function(err, decoded){{
        if(err){
            return res.status(StatusCodes.UNAUTHORIZED).json({accessToken: '', isAuthenticated: false})
        }
        res.status(StatusCodes.OK).json({accessToken, isAuthenticated: true})
    }})
}
module.exports = {
    deleteTask, 
    updateTask, 
    getOneTask,
    createTask, 
    getAllTasks,
    checkAccessToken
}