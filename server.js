const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userScheme')
const app = express()
const dburl = 'mongodb+srv://kasthuriniharika32:login1@cluster1.s40ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
const secret_key = 'secretKey'

mongoose.connect(dburl,{})
.then(() => {
    app.listen(3001,() => {
        console.log("Server mongodb is connected")
    })
})
.catch((err) => {
    console.log("unable to connect to mongodb")
})
app.use(bodyParser.json())
app.use(cors())

app.post('/register',async(req,res)=>{
    try{
        const{email,username,password} = req.body 
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({email,username,password:hashedPassword})
        await newUser.save()
        res.status(201).json({message:"Registration Success"})
    }catch(error){
        res.status(500).json({message:"Error SignIn"})
    }
})

app.get('/register',async(req,res)=>{
    try{
        const users = await User.find()
        res.status(201).json(users)
    }catch(error){
        res.status(500).json({message:"unable to get users"})
    }
})

app.post('/login',async(req,res)=>{
    try{
        const {username,password} = req.body 
        const user = await User.findone({username})
        if(!user){
            return res.sendStatus(401).json({error:"Invalid user"})
        }
        const isPassword = await bcrypt.compare(password,user.password)
        if(!password){
            return res.status(401).json({error:"password error"})
        }
        const token = jwt.sign({userId:user._id},secret_key,{expiresIn:'1hr'})
        res.json({message:"Login Success"})
    }catch(error){
        res.status(500).json({error:"Login Error"})
    }
})