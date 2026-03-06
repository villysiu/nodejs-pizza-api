const Cart = require('../models/Cart')
const Menuitem = require('../models/Menuitem')
const Size = require('../models/Size')
const Ingredient = require('../models/Ingredient')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCarts = async (req, res) => {
    console.log('all carts')
    console.log(req.user)
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
// creating cart
// {
//   menuitemId: '69a07e968ff4d60635ebe7a7',
//   sizeId: '699fb3e506698c69cddd8dab',
//   ingredientDetails: [
//     { ingredientId: '699fb6b05e5b866b91ad778f', qty: 1 },
//     { ingredientId: '699fb25906698c69cddd8da4', qty: 0 },
//     { ingredientId: '699fb24006698c69cddd8da1', qty: 1 },
//     { ingredientId: '69a077758ff4d60635ebe79d', qty: 0 }
//   ],
//   quantity: 1
// }
    const {
        menuitemId,
        sizeId,
        ingredientDetails,
        quantity
    } = req.body

   

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
    
    for(const {ingredientId, qty} of ingredientDetails ){
        const exists = await Ingredient.exists({ _id: ingredientId });
        if(!exists)
            throw new NotFoundError('Ingredient not found');
    }

    const sortedIngredients = [...ingredientDetails].sort((a,b)=>a.ingredientId.localeCompare(b.ingredientId))

    console.log(sortedIngredients)
    const ingredientKey = sortedIngredients
                            .map((ingr)=>`${ingr.ingredientId}-${ingr.qty}`)
                            .join('-')

    console.log("add cart", ingredientKey)
    const repeatedCart = await Cart.findOne({ 
        createdBy: req.user._id, 
        menuitemId,
        sizeId,
        ingredientKey
    })

    if(repeatedCart){
        repeatedCart.quantity += quantity;
        await repeatedCart.save();

        res.status(StatusCodes.CREATED).json({ repeatedCart })
    }
    else{ 
        const unitPrice = sortedIngredients.reduce((total, ingr) => total + ingr.qty * size.perTopping, size.price)
        const cart = await Cart.create({
            createdBy: req.user._id,
            menuitemId,
            sizeId,
            ingredientDetails,
            ingredientKey,
            quantity,
            unitPrice
            
        })
        res.status(StatusCodes.CREATED).json({ cart })
    }
}

const updateCart = async (req, res) => {
    console.log("update cart")
    console.log(req.body)
    //   cartId: '69992f2140affd8172d3bcb3',  from params
    //  {
    //   ingredientDetails: [{ingredientId: '432325', qty: 1} ,'{ingredientId: '33545', qty: 1} ,{ingredientId: '348398239', qty: 1} ]
    //   sizeId: '698142fbfd04af387993d3e4',
    //   quantity: 2
    // }
    const cart = req.resource;
    const {
        sizeId,
        ingredientDetails,
        quantity
    } = req.body

    const size  = await Size.findById(sizeId !== undefined ? sizeId : cart.sizeId)
    if(!size)
        throw new NotFoundError('Size not found')
    cart.sizeId = size._id

    if(ingredientDetails !== undefined){
        for(const {ingredientId, qty} of ingredientDetails ){
            const ingredient = await Ingredient.findById(ingredientId);
            if(!ingredient)
                throw new NotFoundError('Ingredient not found');
        }
        cart.ingredientDetails = ingredientDetails
    } 

    const sortedIngredients = [...cart.ingredientDetails].sort((a, b)=> a.ingredientId.toString().localeCompare(b.ingredientId).toString());
    const ingredientKey = sortedIngredients
                            .map((ingr)=>`${ingr.ingredientId}-${ingr.qty}`)
                            .join('-')
    console.log("update cart", ingredientKey)
    cart.ingredientKey = ingredientKey;

    if(quantity !== undefined){
        if (isNaN(quantity) || quantity <= 0) 
            throw new BadRequestError('Quantity must be a valid number bigger than 0');
        cart.quantity = quantity
    }
    
    const repeatedCart = await Cart.findOne({ 
        createdBy: req.user._id, 
        menuitemId: cart.menuitemId,
        sizeId,
        ingredientKey
    })

    if(repeatedCart){
        cart.quantity += repeatedCart.quantity
        await repeatedCart.deleteOne();
    }
   
    const unitPrice = cart.ingredientDetails.reduce((total,ingr) => total+ingr.qty * size.perTopping, size.price);
    cart.unitPrice = unitPrice;
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