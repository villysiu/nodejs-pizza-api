const express = require('express')

const router = express.Router()
const {
    createCart,
    deleteCart,
    getCarts,
    updateCart,
    getCart,
} = require('../controllers/carts')

const Cart = require('../models/Cart')
const {isOwner} = require('../middleware/authorization')


// Authenitcated user see all his carts and can create new cart
router.route('/')
    .get(getCarts)
    .post(createCart)



// Authenitcated user can delte and update his own cart
router.route('/:id')
    .get( isOwner(Cart), getCart)
    .delete( isOwner(Cart), deleteCart)
    .patch(isOwner(Cart), updateCart);

module.exports = router