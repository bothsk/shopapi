const User = require('../models/user')
const Order = require('../models/order')
const bcrypt = require('bcrypt')

const user_regis = async (req,res) =>{
    const username = req.body.username
    const password = req.body.password
    try {
        if (username&&password){
            const existedUser = await User.findOne({username:username})
            if (existedUser) return res.json({status:{error:true,message:'Username already existed'}})
    
            const hash = bcrypt.hash(password,10)
            const detail  = {
                username:username,
                password:hash
            }
            const createdUser = await User.create(detail)
            return res.json({status:{error:null,message:'Account Created'},createdUser})
           
        }  return res.json({status:{error:true,message:'Please input username and password'}})
    } catch (err) {
        
        return res.json({status:{error:true,message:'DB processing error'},err:err.message})
    }
    
    
}

const user_login = async (req,res) => {
        const name = await User.findOne({_id:req.session.passport.user})
        res.send(`Hi ${name.username}!`)    
}


const user_order = async (req,res)=>{
    try {
        const allOrders = req.user.isAdmin ? await Order.find() : await Order.findOne({orderedBy:req.user.username})
        if (!allOrders) return res.json({status:{error:true,message:`Not found any order related account : ${req.user.username}`}})
        res.send(allOrders)
    } catch{
        return res.json({status:{error:true,message:'DB processing error'}})
    }
        

}


module.exports = {
    user_login,
    user_regis,
    user_order
}