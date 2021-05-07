const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');



//@ route: GET/  /admin/users
//@ description:  Get all users
//@ access: private/admin

exports.getUsers = asyncHandler(async (req, res, next)=>{
  const users = await User.find({});
  res.json(users)

}) 