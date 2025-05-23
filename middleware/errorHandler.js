const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let message = ''
  console.log('-------------------------------------')
  console.log(err.message)
  console.log('-------------------------------------')

  let error = { ...err }
  error.message = err.message
  // console.log('-------------------------------------')
  // console.log(error)
  // console.log('-------------------------------------')
  // Mongosee Bad Object ID :
  if (err.name === 'CastError') {
    message = `Resource Not found with the id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  // Mongosee Duplicate Key :
  if (err.code === 11000) {
    let message
    if (error.keyValue.email) {
      message = 'Email already in use.'
    } else {
      message = 'Resource name already in use'
    }
    error = new ErrorResponse(message, 400)
  }

  //   Mongoose Valdaitaion Error :
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }
  res.status(error.statusCode || 500).json({
    succses: false,
    error: error.message || 'ServerError',
  })
}

module.exports = errorHandler
