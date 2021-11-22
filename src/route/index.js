const express = require('express')
const { registerUser, loginUser, logout, verifyEmail } = require('../controller')
const { validateUser, checkUser } = require('../middleware')
const { registerUserSchema, loginUserSchema } = require('../validation')
const router = express.Router()


router.post(
    '/api/register-user/',
    validateUser(registerUserSchema, 'body'),
    checkUser('signup'),
    registerUser,
)

router.post(
    '/api/login-user',
    validateUser(loginUserSchema, 'body'),
    checkUser('login'),
    loginUser,
)

router.get(
    '/api/logout',
    checkUser('login'),
    logout,
)


module.exports = router