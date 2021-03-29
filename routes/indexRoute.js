const express = require('express')
const router = express.Router()
const passport = require('passport')
const { user_login,user_regis,user_order,user_failed,user_logout } = require('../controllers/indexController')
const { isLoggedIn,isLoggedOut } = require('../passport')
require('../passport')



router.get('/',(req,res)=>{
    res.send("index")
})

router.get('/order',isLoggedIn,user_order)

router.post('/regis',isLoggedOut,user_regis)


router.post('/login',isLoggedOut,passport.authenticate('local', { failWithError: true }),user_login,user_failed)


router.get('/logout',isLoggedIn,user_logout)

module.exports = router
