const express = require('express');
const router = express.Router();
const {
    createMenuitem,
    updateMenuitem,
    getMenuitems,
    getMenuitem,
    deleteMenuitem
} = require('../controllers/menuitems')

const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')

const Menuitem = require('../models/Menuitem')
const {getResourceById} = require('../middleware/validateRequest')


//public 
router.get("/", getMenuitems);
router.get("/:id", getResourceById(Menuitem), getMenuitem);

// admin
router.post("/", authenticateUser, isAdmin, createMenuitem);
router.patch("/:id", authenticateUser, isAdmin, getResourceById(Menuitem), updateMenuitem);
router.delete("/:id", authenticateUser, isAdmin, getResourceById(Menuitem), deleteMenuitem);

module.exports = router