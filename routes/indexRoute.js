const express = require('express')
const router = express.Router()
const passport = require('passport')
const { user_login,user_regis,user_order } = require('../controllers/indexController')
const { isLoggedIn,isLoggedOut } = require('../passport')
require('../passport')



router.get('/',(req,res)=>{
    res.send("index")
})

router.get('/order',isLoggedIn,user_order)

router.post('/regis',isLoggedOut,user_regis)

router.post('/login',isLoggedOut,passport.authenticate('local'),user_login)



router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut()
    res.json({status:{error:null,message:'Successfully logout'}})
})

module.exports = router
