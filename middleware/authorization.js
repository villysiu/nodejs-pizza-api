const Cart = require('../models/Cart')
const { NotFoundError } = require('../errors'); 
const isAdmin = async (req, res, next) => {
    console.log("check user is admin")
    console.log(req.user)


    if(!req.user)
        return res.status(401).json({message: "Unauthorized"})
    

    if(req.user.role !== "ADMIN")
        return res.status(403).json({message: "Forbidden"})

    next();
}

const isOwner = (Model) => {
    return async (req, res, next) => {
        console.log('check if cart/order belonged to user')

        const {
            user: { _id: userId },
            params: { id: itemId },
        } = req

        const item = await Model.findOne({
            _id: itemId,
            createdBy: userId,
        })

        if (!item) {
            // const error = new Error(`No item with id ${itemId} owned by user`);
            // error.statusCode = 404;
            // throw error;
            throw new NotFoundError(`No item with id ${itemId} owned by user`)
        }
        req.resource = item
  
        next();
    }
}

module.exports = {isAdmin, isOwner}
