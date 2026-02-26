const Size = require('../models/Size')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getSizes = async (req, res) => {
  const sizes = await Size.find();
  res.status(StatusCodes.OK).json({ sizes })
}


const getSize = async (req, res) => {
  res.status(StatusCodes.OK).json( {size: req.resource} )
}

const createSize = async (req, res) => {
  const { title, price } = req.body

  if (!title || title.trim() === '') {
    throw new BadRequestError('Title is required')
  }

  if (price === undefined || isNaN(price)) {
    throw new BadRequestError('Price must be a valid number')
  }

  const size = await Size.create({
    title: title.trim(),
    price: Number(price)
  })

  res.status(StatusCodes.CREATED).json({ size })
}


const updateSize = async (req, res) => {
  const size = req.resource
  const { title, price } = req.body;

  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    size.title = title.trim()
  }
  if (price !== undefined) {
    if (isNaN(price)) 
      throw new BadRequestError('Price must be a number')

    size.price = Number(price)
  }
  await size.save()
  
  res.status(StatusCodes.OK).json({ size })
}

const deleteSize = async (req, res) => {
  
  const size = req.resource
  await size.deleteOne()
  res.status(StatusCodes.OK).json({ 'message': 'Size deleted successfully'})
}

module.exports = {
  createSize,
  deleteSize,
  getSizes,
  updateSize,
  getSize,
}