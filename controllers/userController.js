const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken= require('../utils/generateToken');
const nodemailer = require('nodemailer');
const sedgridTransport = require('nodemailer-sendgrid-transport');




// initialize nodemailer transporter
const transporter = nodemailer.createTransport(sedgridTransport({
    auth:{
        api_key: process.env.SEND_GRID_KEY
    }
}))





//@ route: POST/  /register
//@ description: add new user
//@ access: public
exports.postRegisterUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmedPassword } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("email is required");
}
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("password is required and have to be at least 6 characters long");
}
if (password !== confirmedPassword) {
    res.status(400);
    throw new Error("password dose not match");
  }

  if (!username) {
    username = email;
  }

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(400);
    throw new Error("user already exists");
  }

  const hashedPassword = (await bcrypt.hash(password, 12)).toString();

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
     const email1 = await transporter.sendMail({
          to: user.email,
          from:'emad.mhardawi@chasacademy.se',
          subject:'Signup succeeded!',
          html: '<h1> you successfully signed up </h1>'
      })
    res.status(200).json({
      username: user.username,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data, something went wrong");
  }
});



//@ route: POST/  /login
//@ description: Auth user & get JWT
//@ access: public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user){
      res.status(404);
      throw new Error('no account is attached with this email');
  }

  //check if the provided password match the password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (user && passwordMatch) {
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});
