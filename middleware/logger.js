// all miidleware functions have (req , res , next)
// @desc Logs request to console
const looger = (req, res, next) => {
  const log_str = `${req.method} , ${req.protocol}://${req.get('host')}${
    req.originalUrl
  }`
  console.log(log_str)
  next()
}

module.exports = looger
