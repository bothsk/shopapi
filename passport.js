const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy(async (username,password,done)=>{
    const user = await User.findOne({username:username})
    if (!user) return done(null,false)
    
    const checkPwd = await bcrypt.compare(password,user.password)
    if (!checkPwd) return done(null,false)

    done(null,user)
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if (err) return done(err)
        done(null,user)
    })
})

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    return res.status(500).send({status:{error:true,message:'Please login'}})
}

function isLoggedOut(req,res,next){
    if (!req.isAuthenticated()){
        return next()
    }
    return res.status(500).send({status:{error:true,message:'Redirect to Main menu'}})
}

function isAdmin(req,res,next){
    if (req.user.isAdmin){
        return next()
    } 
    return res.status(404).send({status:{error:true,message:'Only admin can access this page'}})
}


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin
}