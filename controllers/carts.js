const Cart = require('../models/Cart')
const Menuitem = require('../models/Menuitem')
const Size = require('../models/Size')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCarts = async (req, res) => {
    const carts = await Cart.find({ createdBy: req.user._id })
    // .populate({
    //     path: 'menuitemId',
    //     select: 'title  _id'
    // })
    // .populate({
    //   path: 'sizeId',
    //   select: 'title price _id'
    // })
    // .populate({
    //   path: 'ingredients.ingredientId'',
    //   select: 'title price _id qty'
    // })
    .sort('-updatedAt')

    const subtotal = carts.reduce((acc, cart) => (
        acc + cart.unitPrice * cart.quantity
    ), 0)

    res.status(StatusCodes.OK).json({ carts, subtotal })
}
// no use
const getCart = async (req, res) => {
    
    const cart = req.resource
    res.status(StatusCodes.OK).json({ cart })
}

const createCart = async (req, res) => {
    console.log("creating cart")
    console.log(req.body)
//     {
//   menuitemId: '69814634fd04af387993d3fa',
//   sizeId: '698142fbfd04af387993d3e4',
//   ingredientIds: [{ingredientId: '432325', qty: 1} ,'{ingredientId: '33545', qty: 1} ,{ingredientId: '348398239', qty: 1} ]
//   quantity: 1
// }
    const {
        menuitemId,
        sizeId,
        ingredients,
        quantity
    } = req.body

    let unitPrice = 0

    if(!menuitemId || !sizeId )
        throw new BadRequestError('menuitemId and sizeId required.')

    const menuitem = await Menuitem.findById(menuitemId)
    if(!menuitem)
        throw new NotFoundError('Menuitem not found')

    const size = await Size.findById(sizeId)
    if(!size)
        throw new NotFoundError('Size not found')

    if (quantity!==undefined && (isNaN(quantity) || quantity <= 0)) {
        throw new BadRequestError('Quantity must be a valid number bigger than 0');
    }

    unitPrice += size.price

    if(ingredientIds.length > 0) {

        ingredientIds.map(async (data) => {
            const {ingredientId, qty} = data
            const ingredient = await Ingredient.findById(ingredientId);
            if(!ingredient)
                throw new NotFoundError('Ingredient not found');
            unitPrice += qty * size.perTopping;
        })
    }

    const cart = await Cart.create({
        createdBy: req.user._id,
        menuitemId,
        sizeId,
        ingredientIds,
        quantity,
        unitPrice
        
    })
    res.status(StatusCodes.CREATED).json({ cart })
}

const updateCart = async (req, res) => {
    console.log("update cart")
    console.log(req.body)
    //   cartId: '69992f2140affd8172d3bcb3',  from params
    //  {
    //   ingredientIds: [{ingredientId: '432325', qty: 1} ,'{ingredientId: '33545', qty: 1} ,{ingredientId: '348398239', qty: 1} ]
    //   sizeId: '698142fbfd04af387993d3e4',
    //   quantity: 2
    // }
    const cart = req.resource;
    const {
        sizeId,
        ingredientIds,
        quantity
    } = req.body

    const size  = await Size.findById(sizeId !== undefined ? sizeId : cart.sizeId)
    if(!size)
        throw new NotFoundError('Size not found')
    cart.sizeId = size._id

    let unitPrice = size.price
    
    const tempIngredientIds  = ingredientIds !== undefined ? ingredientIds : cart.ingredientIds
    for(const {ingredientId, qty} of tempIngredientIds ){
        const ingredient = await Ingredient.findById(ingredientId);
        if(!ingredient)
            throw new NotFoundError('Ingredient not found');

        unitPrice += qty * size.perTopping;
    }
    cart.ingredientIds = tempIngredientIds;

    if (quantity!==undefined)
        if(isNaN(quantity) || quantity <= 0){
            throw new BadRequestError('Quantity must be a valid number bigger than 0');
        cart.quantity =  quantity
    }

    
    cart.unitPrice = unitPrice
        
    await cart.save()

    res.status(StatusCodes.OK).json({ cart })
}

const deleteCart = async (req, res) => {
  const cart = req.resource
  await cart.deleteOne()
  res.status(StatusCodes.OK).json({'message': 'cart is deleted successfully'})
}

module.exports = {
  createCart,
  getCart,
  deleteCart,
  getCarts,
  updateCart
}