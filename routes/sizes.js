const express = require('express')

const router = express.Router()
const {
    createSize,
    deleteSize,
    getSizes,
    updateSize,
    getSize,
} = require('../controllers/sizes')

const Size = require('../models/Size')
const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')
const {getResourceById} = require('../middleware/validateRequest')

//public 
router.get("/", getSizes);
router.get("/:id", getResourceById(Size), getSize);

// admin
router.post("/", authenticateUser, isAdmin, createSize);
router.patch("/:id", authenticateUser, isAdmin, getResourceById(Size), updateSize);
router.delete("/:id", authenticateUser, isAdmin, getResourceById(Size), deleteSize);

module.exports = router