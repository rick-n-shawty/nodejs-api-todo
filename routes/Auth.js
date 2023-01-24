const express = require('express')
const router = express.Router()
const {Register, Login, Logout, refresh_token} = require('../Controllers/Auth')


router.post('/login', Login)
router.post('/register', Register)
router.post('/logout', Logout)
router.post('/access_token_recovery', refresh_token);

module.exports = router