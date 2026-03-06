const User = require('../models/User')
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const OrderDetail = require('../models/OrderDetail')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const getCurrentUser = async (req, res) => {
  // console.log(req.user)
  const { _id: userId, email, name, role} = req.user
  res.status(StatusCodes.OK).json({ user: { userId, email, name, role } } )
}

const register = async (req, res) => {
  const user = await User.create({ ...req.body })

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json(
    { user: {
        userId: user._id, 
        email: user.email,
        name: user.name, 
        role: user.role 
    }, 
    token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // check if user existed by email
  const user = await User.findOne({email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  console.log(user)
  
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
     user: 
        {
          userId: user._id, 
          email: user.email,
          name: user.name, 
          role: user.role 
        } , 
        token
  })
}

const updateCredential = async (req, res) => {
  const user = req.user;
  const {name, currPassword, newPassword} = req.body
  console.log(req.body)
  console.log("update", user)

  if(name !== undefined){
    if (name.trim() === '') {
      throw new BadRequestError('User name cannot be empty')
    }
    user.name = name.trim()
  }
  if(currPassword !== undefined && newPassword !== undefined){
    const isPasswordCorrect = await user.comparePassword(currPassword)
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
  }
// camflouage the password in pre save
  await user.save()
  res.status(StatusCodes.OK).json({ user})
}

// ADMIN ROLE ONLY
const getUsers = async (req, res) => {
  const users = await User.find()
      .select('name  email role')

  res.status(StatusCodes.OK).json({users});
}

const updateRole = async (req, res) => {
  const {
            body: { role },
            params: { id: userId },
        } = req

  const user = await User.findById(userId);
  if(!user)
    throw new NotFoundError(`No user with id ${userIdToDelete}`);
  
  user.role = role;
  await user.save();
  res.status(StatusCodes.OK).json({
     user: 
        {
          userId: user._id, 
          email: user.email,
          name: user.name, 
          role: user.role 
        }
      })
}

const deleteUser = async (req, res) => {
  const { id: userIdToDelete } = req.params;


  // ADMIN can delete any user, and carts and orders and orderDetails related
  if(userIdToDelete === undefined ){
    throw new BadRequestError('User id needed.');

  const user = await User.findById(userIdToDelete)
  if(!user)
    throw new NotFoundError(`No user with id ${userIdToDelete}`);

  await user.deleteOne();

  await Cart.deleteMany({ createdBy: user._id });

  const orders = await Order.find({ createdBy: user._id });
  for(const order of orders){
    await OrderDetail.deleteMany({orderId: order._id})
  }
  await Order.deleteMany({ createdBy: user._id });


  res.status(StatusCodes.OK).json({ 'message': 'user deleted by admin' })
  } 


}



module.exports = {
  register,
  login,
  updateCredential,
  getCurrentUser,
  getUsers,
  updateRole,
  deleteUser
}