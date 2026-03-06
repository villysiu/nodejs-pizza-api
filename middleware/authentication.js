
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const User = require('../models/User')

const auth = async (req, res, next) => {
  // check header
  console.log("check user login")
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    console.log('payload', payload)
    console.log(typeof payload)
// attach the user to the header
    const user = await User.findById(payload.userId)
    if(!user){
      throw new NotFoundError(`No user with id ${payload.userId}`)
  }
    req.user = user
    console.log('req.user', req.user)
    next()

  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth