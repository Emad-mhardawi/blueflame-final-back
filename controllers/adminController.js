const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@ route: GET/  /admin/users
//@ description:  Get all users
//@ access: private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  if (users) {
    res.json(users);
  } else {
    res.json({ message: "no users found" });
  }
});


//@ route: Delete/  /admin/deleteUser/userId
//@ description:  delete  user
//@ access: private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.query.userId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  const deletedUser = await User.deleteOne(user);
  if (deletedUser) {
    res.json({
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error("some thing went wrong");
  }
});
