const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const Ingredient = require('../models/Ingredient')
const { BadRequestError, NotFoundError } = require('../errors')

const createIngredient = async (req, res) => {
    // let database validate
    const { title, category, price } = req.body;

    if (!title || title.trim() === '') {
        throw new BadRequestError('Title cannot be empty')
    }
    
    if (!category || !['VEGETABLES', 'MEATS', 'OTHERS'].includes(category)) 
        throw new BadRequestError( 'Invalid category' );
    

    if (price === undefined || typeof price !== 'number' || price < 0)
        throw new BadRequestError( 'Price must be a non-negative number' );
        
    const ingredient = await Ingredient.create({ title, category, price });

    res.status(StatusCodes.CREATED).json( {ingredient} )
}


const updateIngredient = async (req, res) => {
    const ingredient = req.resource

    const { title, category, price } = req.body;

    if(title !== undefined){
        if (title.trim() === '') {
        throw new BadRequestError('Title cannot be empty')
        }
        ingredient.title = title.trim()
    }
    
    if(category !== undefined ) {
        if (!['VEGETABLES', 'MEATS', 'OTHERS'].includes(category)) 
            throw new BadRequestError( 'Invalid category' );
    
        ingredient.category = category
    }
    if(price !== undefined){
        if (typeof price !== 'number' || price < 0) 
            throw new BadRequestError( 'Price must be a non-negative number' );
        ingredient.price = price
    }
    await ingredient.save()

    res.status(StatusCodes.OK).json( {ingredient} )
}


const getIngredients = async (req, res) => {
  
  const ingredients = await Ingredient.find()
    .select('title price category _id');
    
  res.status(StatusCodes.OK).json({ingredients, 'count': ingredients.length});
};



const getIngredient = async (req, res) => {
  const ingredient =  await req.resource
    // .populate('category', 'title -_id')
  res.status(StatusCodes.OK).json( {ingredient} )
}



const deleteIngredient = async (req, res) => {

  const ingredient = req.resource
  await ingredient.deleteOne()

  res.status(StatusCodes.OK).json({ 'message': 'ingredient item deleted' })
}



module.exports = {
  createIngredient,
  updateIngredient,
  getIngredients,
  getIngredient,
  deleteIngredient
}
