const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    const head = req.headers.authorization
    if(!head) return res.status(401).json({msg: 'not authorized'})
    const token = head.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, function(err, decoded){
        if(err){
            return res.status(401).json({msg: 'not authorized'})
        }
        req.userId = decoded.userId
        next()
    })
}
module.exports = auth