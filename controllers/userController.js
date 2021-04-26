const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


//@ route: POST/  /register
//@ description: add new user 
//@ access: public
exports.postRegisterUser = asyncHandler( async(req, res, next)=>{
    const {username, email, password, confirmedPassword} = req.body;
    if(!email ){
        res.status(400)
        throw new Error('email is required');
    }
    
    if(!password  || password.length < 6){
        res.status(400)
        throw new Error('password is required and have to be at least 6 characters long');
    }
    
    if(password !== confirmedPassword ){
        res.status(400)
        throw new Error('password dose not match');
    }
    
    if(!username){
        username = email;
    }
    
    const userExist = await User.findOne({email:email})
    
    if(userExist){
        res.status(400);
        throw new Error('user already exists')
    }
    
    const hashedPassword = (await bcrypt.hash(password, 12)).toString()
    
    const user = await User.create({username:username, email:email, password:hashedPassword })
    
    if(user){
    res.status(201).json({
        username: user.username,
    })
    }else{
        res.status(400);
        throw new Error('invalid user data, something went wrong')
    }
    
    })