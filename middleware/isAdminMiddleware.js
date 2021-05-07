const asyncHandler = require("express-async-handler");



const isAdmin = asyncHandler(async (req, res, next) => {
  //check if the logged in user is admin
  if (req.user && req.user.isAdmin) {
      next()
  }else{
      res.status(401)
      throw new Error('not authorized as an admin')
  }
});

module.exports = isAdmin;
