const express = require('express')
const router = express.Router()
const { register, login, updateCredential, getCurrentUser, getUsers, updateRole, deleteUser } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization');

router.post('/register', register)
router.post('/login', login)

// secure
router.patch('/', authenticateUser, updateCredential)
router.get('/me', authenticateUser, getCurrentUser)

// ADMIN ONLY
router.get('/', authenticateUser, isAdmin, getUsers)
router.delete('/:id', authenticateUser, isAdmin, deleteUser)
router.patch('/:id', authenticateUser, isAdmin, updateRole)


module.exports = router