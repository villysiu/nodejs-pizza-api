const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const Menuitem = require('../models/Menuitem')
const Ingredient = require('../models/Ingredient')
const { BadRequestError, NotFoundError } = require('../errors')


const createMenuitem = async (req, res) => {
  
  const {
    title,
    description,
    imageUrl,
    ingredientIds,
    active
  } = req.body
  
  if(!title  || title.trim() === '') 
    throw new BadRequestError('Title cannot be empty')

  for(const ingredientId of ingredientIds){
      const exists = await Ingredient.exists({ _id: ingredientId  });
      if (!exists) 
          throw new NotFoundError(`No ingredient with id ${id}`);
  }


  if(!active || typeof active !== 'boolean')
    throw new BadRequestError('Active required and must be boolean')

  const menuitem = await Menuitem.create({
    title: title.trim(),
    imageUrl: imageUrl.trim(),
    description,
    active,
    ingredientIds
  })

  res.status(StatusCodes.CREATED).json( {menuitem} )
}


const updateMenuitem = async (req, res) => {
  const menuitem = req.resource

  const {
    title,
    imageUrl,
    description,
    ingredientIds,
    active
  } = req.body

  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    menuitem.title = title.trim()
  }
  
  if(ingredientIds !== undefined && ingredientIds.length > 0) {

    for(const ingredientId of ingredientIds){
      const exists = await Ingredient.exists({ _id: ingredientId });
        if (!exists) 
            throw new NotFoundError(`No ingredient with id ${id}`);
    }
  
    menuitem.ingredientIds = ingredientIds;
  }
  
  if(imageUrl !== undefined) 
    menuitem.imageUrl = imageUrl.trim()
  
  if(description !== undefined)
    menuitem.description = description;
  
  if (active !== undefined) {
    if(typeof active !== 'boolean')
      throw new BadRequestError('Active must be boolean')
    menuitem.active = active;
  }

  await menuitem.save()

  res.status(StatusCodes.OK).json( {menuitem} )
}


const getMenuitems = async (req, res) => {
  
  // const menuitems = await Menuitem.find()
  //  .populate({
  //       path: 'ingredientIds',
  //       select: '_id title  price'
  //   })
  let query = {};

  if(req.query.q){

    const searchWord = req.query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const ingredients = await Ingredient.find({
      title: { $regex: searchWord, $options: "i" }
    }).select("_id");

    const ingredientIds = ingredients.map(i => i._id);

    query = {
      $or: [
        { title: { $regex: searchWord, $options: "i" } },
        { ingredientIds: { $in: ingredientIds } }
      ]
    };
  }

  const menuitems = await Menuitem.find(query);
  res.status(StatusCodes.OK).json({menuitems, 'count': menuitems.length});
};



const getMenuitem = async (req, res) => {
  const menuitem =  await req.resource
  res.status(StatusCodes.OK).json( {menuitem} )
}



const deleteMenuitem = async (req, res) => {

  const menuitem = req.resource
  await menuitem.deleteOne()

  res.status(StatusCodes.OK).json({ 'message': 'Menu item deleted' })
}



module.exports = {
  createMenuitem,
  updateMenuitem,
  getMenuitems,
  getMenuitem,
  deleteMenuitem
}
