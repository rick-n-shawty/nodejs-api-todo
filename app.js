require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

app.use(express.json())

const AuthRouter = require('./Routes/Auth')
const TaskRouter = require('./Routes/Tasks')
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const cors = require('cors')
const connect = require('./DB/connect')
const {ErrorHandler, NotFound} = require('./middleware/ErrorHandler')

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})) 

app.set('trust proxy', 1);
app.use(cookieParser())

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 110
}))
app.use(express.json())
app.use(helmet())
app.use(xss())

app.use('/', AuthRouter)
app.use('/', auth, TaskRouter)

app.use(ErrorHandler)
app.use(NotFound)

app.get('/', (req, res) =>{
res.send('<h1>This API has been created by Sam :)</h1>')
})
const port = process.env.PORT || 5000
const start = async () => {
    try{
        // db connection
        await connect(process.env.MONGO_URI)
        app.listen(port, ()=> console.log('server is up'))
    }catch(err){
        console.log(err)
        return res.status(500).json({err: 'server error'})
    }
}
start()