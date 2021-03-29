const User = require('../models/user')
const Order = require('../models/order')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('email-validator')

const user_regis = async (req,res) =>{
    const {username,password,email,isAdmin} = req.body
    try {
        if (username&&password&&email){
            if (!userValid(username,password,email)) return res.json({status:{error:true,message:message}})
            const existedUser = await User.findOne({username:username})
            if (existedUser) return res.json({status:{error:true,message:'Username already existed'}})

            const existedEmail = await User.findOne({email:email})
            if (existedEmail) return res.json({status:{error:true,message:'Email already existed'}})

            const hash = bcrypt.hashSync(password,10)
            const createdUser = await User.create({
                username:username,
                password:hash,
                email:email,
                isAdmin:isAdmin
            })
            return res.json({status:{error:null,message:'Account Created'},createdUser})
           
        }  return res.json({status:{error:true,message:'Please input username, password and email'}})
    } catch (err) {
        
        return res.json({status:{error:true,message:'DB processing error'},err:err.message})
    }
    
    
}


let message 
const userValid = (username,password,email)=>{
    if (username.length<6) {
        message = "User required at least 6 characters"
        return false
    }
    
    if (password.length<4){
        message = "Password required at least 4 characters"
        return false
    }

    if (!validator.validate(email)){
        message = "Wrong email input format"
        return false
    }

    return true
}


const user_login =  async (req, res, next)=> {
    // Handle success
        return res.status(200).json({status:{error:null,message:`Username : ${req.user.username} has been logged in`},user:req.user._id})
  }

const user_failed = (err,req, res, next)=> {
    // Handle error
     return res.status(401).json({status:{error:true,message:`Incorrect username or password`}})
}


const user_logout = (req,res)=>{
    req.logOut()
    res.json({status:{error:null,message:'Successfully logout'}})
}

const user_order = async (req,res)=>{
    try {
        const allOrders = req.user.isAdmin ? await Order.find() : await Order.find({orderedBy:req.user.username})
        if (!allOrders) return res.json({status:{error:true,message:`Not found any order related account : ${req.user.username}`}})
        res.json(allOrders)
    } catch{
        return res.json({status:{error:true,message:'DB processing error'}})
    }
        

}

///////////////////////////
const user_forget = async (req,res)=>{
    const { email } = req.body
    if (!email||!validator.validate(email)) return res.json({status:{error:true,message:'Incorrect email input'}})
   
    try {
        const checkEmail = await User.findOne({email:email})
    if (!checkEmail) return res.json({status:{error:true,message:'Not found user related to this email'}})
    
    const token = jwt.sign({user:checkEmail.username},process.env.jwtSecret+checkEmail.password,({expiresIn:'5m'}))
    res.send(`http://localhost:3000/reset/${checkEmail.username}/${token}`)
    } catch (err) {
        
    return res.json({status:{error:true,message:'DB processing error'},err:err.message})
    }
}


const user_reset = async (req,res)=>{
    const { user,token } = req.params
    const { password} = req.body

    try{
        const checkedUser = await User.findOne({username:user})
        if (!checkedUser) return res.json({status:{error:true,message:`Not found User in DB`}})
        
        let checkedToken
        try {
            checkedToken = jwt.verify(token,process.env.jwtSecret+checkedUser.password)
        } catch {
        return res.json({status:{error:true,message:`Invalid token or token was expired`}})
        }
        if (!password)  return res.json({status:{error:true,message:`Please input new password`}})
        const hashed = bcrypt.hashSync(password,10)
        const resetUser = await User.findOneAndUpdate({username:checkedToken.user},{password:hashed})
        if (!resetUser) return res.json({status:{error:true,message:`Not found user related to this token`}})

        return res.json({status:{error:null,message:`User ${resetUser.username} has been reset password`}})  
    } catch (err) {
        
        return res.json({status:{error:true,message:'DB processing error'},err:err.message})
     }
}


module.exports = {
    user_login,
    user_regis,
    user_order,
    user_failed,
    user_logout,
    user_forget,
    user_reset
}