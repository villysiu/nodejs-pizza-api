const { NotFoundError } = require('../errors'); 

const getResourceById = (Model) => {
    return async (req, res, next) => {
        console.log('check if itemId existed')

        const { id: itemId } = req.params

        const item = await Model.findById(itemId)

        if (!item) {
            throw new NotFoundError(`No ${Model.modelName} with id ${itemId}`)
        }
    
        req.resource = item
        next();
    }
}


module.exports = {getResourceById}