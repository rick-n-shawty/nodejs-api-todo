const {StatusCodes} = require('http-status-codes')
const ErrorHandler = (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        err: err.message || 'Something went wrong try again later',
    }
    if (err.name === 'ValidationError') {
        customError.err = Object.values(err.errors)
          .map((item) => item.message)
          .join(',')
        customError.statusCode = 400
      }
      if (err.code && err.code === 11000) {
        customError.err = `Duplicate value entered for ${Object.keys(
          err.keyValue
        )} field, please choose another value`
        customError.statusCode = 400
      }
      if (err.name === 'CastError') {
        customError.err = `No item found with id : ${err.value}`
        customError.statusCode = 404
      }
    
      return res.status(customError.statusCode).json({ err: customError.err })
}

const NotFound = (req, res) => res.status(StatusCodes.NOT_FOUND).json({err: 'sorry, this resource does not exist...'})
module.exports = {
    ErrorHandler,
    NotFound
}