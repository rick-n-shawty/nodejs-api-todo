const jwt = require('jsonwebtoken')

const createAccessToken = (userId, username) =>{
    return jwt.sign({userId, username}, process.env.ACCESS_JWT_SECRET, {expiresIn: process.env.ACCESS_LIFETIME})
}
const createRefreshToken = (userId, username) =>{
    return jwt.sign({userId, username}, process.env.REFRESH_JWT_SECRET, {expiresIn: process.env.REFRESH_LIFETIME})
}
module.exports = {
    createAccessToken, 
    createRefreshToken
}