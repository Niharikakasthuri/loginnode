const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
    email:{
        type:String,
        required:true 
    },
    username:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true 
    }
})
const User = mongoose.model('User',userScheme)
module.exports = User