const jwt = require('jsonwebtoken')
const User = require('../DB/User');
const Task = require('../DB/Task')
const {StatusCodes} = require('http-status-codes')
const {BadRequest, Unauthenticated} = require('../Errors')
const {createAccessToken, createRefreshToken} = require('../middleware/tokens')
const Login = async (req, res) =>{
    const {email, password} = req.body
    if(!email || !password) throw new BadRequest('please provide all values...')

    const user = await User.findOne({email})
    if(!user) throw new BadRequest('user not found')
    const isValid = await user.Compare(password)
    if(!isValid) throw new BadRequest('the provided password is incorrect...');
    const tasks = await Task.find({createdBy: user._id})
    const accessToken = createAccessToken(user._id, user.email)
    const refreshToken = createRefreshToken(user._id, user.email)

    res.status(StatusCodes.OK).json({accessToken,  refreshToken, tasks, username: user.email})
}
const refresh_token = async (req, res) =>{
    const {refreshToken} = req.body
    if(!refreshToken) throw new Unauthenticated('you are not authorized!')

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async (err, decoded) =>{
        if(err){
            return res.status(StatusCodes.UNAUTHORIZED).json({accessToken: '', refreshToken: '', msg: "couldn't verify token"})
        }
        const newRefresh = createRefreshToken(decoded.userId, decoded.username)
        const accessToken = createAccessToken(decoded.userId, decoded.username)
        const tasks = await Task.find({createdBy: decoded.userId})
        res.status(StatusCodes.OK).json({accessToken, refreshToken: newRefresh, tasks, username: decoded.username})
    })
}

const Register = async (req, res) =>{
    const {name, email, password} = req.body
    // 1 - check if all credentials are provided
    if(!name || !email || !password) throw new BadRequest('please provide all credentials...')
    // 2 - if so, create a new user
    const user = await User.create(req.body)

    const accessToken = createAccessToken(user._id)
    const refreshToken = createRefreshToken(user._id)
    res.status(StatusCodes.CREATED).json({accessToken, refreshToken, username: user.email})
  
}

const Logout = (req, res) =>{
    res.status(StatusCodes.OK).json({accessToken: '', refreshToken: ''})
}

module.exports = {
    Register, Login, Logout, refresh_token
}