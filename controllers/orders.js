const Order = require('../models/Order')
const Cart = require('../models/Cart')
const OrderDetail = require('../models/OrderDetail')

const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getOrders = async (req, res) => {
  console.log('see all orders without details')
  const orders = await Order.find({ createdBy: req.user._id })
    .sort('-createdAt')

  res.status(StatusCodes.OK).json({ orders })
}

const getOrder = async (req, res) => {
  
  const order = req.resource
  const orderDetails = await OrderDetail.find({ 'orderId': order._id})
    // .select('-_id')
    // .populate('menuitem', 'title -_id')
    // .populate('size', 'title -_id')


  res.status(StatusCodes.OK).json({ 
    ...order.toObject(), 
    orderDetails
    
  })
}

const createOrder = async (req, res) => {

  const carts = await Cart.find({'createdBy': req.user._id})
  .select('menuitemId sizeId ingredientDetails quantity unitPrice -_id')

  console.log(carts)
  if(carts.length === 0)  
    throw new BadRequestError("Cart is empty" )

  // cart total
  const total = carts.reduce((acc, cart) => 
    acc + cart.unitPrice * cart.quantity,
    0
  )
  const order = await Order.create({
    createdBy: req.user._id,
    total
  })

  // create orderDetails data so if crashed, it wont mess up the database with partial data
  const orderDetailsData = carts.map(cart => (
    {
      orderId: order._id,
      ...cart.toObject()
      // menuitemId: cart.menuitemId,
      // sizeId: cart.sizeId,
      // ingredientDetails: cart.ingredientDetails,
      // quantity: cart.quantity,
      // unitPrice: cart.unitPrice
    }
  ))

  const orderDetails = await OrderDetail.insertMany(orderDetailsData)


  // delete user cart
  await Cart.deleteMany({ createdBy: req.user._id })


  res.status(StatusCodes.CREATED).json({ 
    ...order.toObject(),
    orderDetails
  }) 
}

// No update order, order is genearated by user and order details. If orderDetails change, order total will change
// Admin only

// const updateOrder = async (req, res) => {
//   const order = req.resource

  
//   res.status(StatusCodes.OK).json({ 
//     ...order.toObject(),
//     orderDetails: {
//       orderDetailsData,
//       count: orderDetailsData.length 
//     } 
//   })
// }

const deleteOrder = async (req, res) => {
  const order = req.resource

  await OrderDetail.deleteMany({ order: order._id })
  await order.deleteOne()

  res.status(StatusCodes.OK).json({'message': `Order ${order._id} and its details deleted`})
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrders,
  // updateOrder,
  getOrder,
}