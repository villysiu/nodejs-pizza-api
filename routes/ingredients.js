const express = require('express')

const router = express.Router()
const {
    createIngredient,
    deleteIngredient,
    getIngredients,
    updateIngredient,
    getIngredient,
} = require('../controllers/ingredients')

const Ingredient = require('../models/Ingredient')
const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')
const {getResourceById} = require('../middleware/validateRequest')

//public 
router.get("/", getIngredients);
router.get("/:id", getResourceById(Ingredient), getIngredient);

// admin
router.post("/", authenticateUser, isAdmin, createIngredient);
router.patch("/:id", authenticateUser, isAdmin, getResourceById(Ingredient), updateIngredient);
router.delete("/:id", authenticateUser, isAdmin, getResourceById(Ingredient), deleteIngredient);

module.exports = router