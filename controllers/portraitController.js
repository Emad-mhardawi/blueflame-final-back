const Portrait = require("../models/PortraitModel");
const asyncHandler = require("express-async-handler");




exports.addPortrait = asyncHandler(async (req, res, next) => {
  const { portraitStyle, description, price } = req.body;

  const portriat = await Portrait.create({ portraitStyle,description,price });
  if(portriat){
      res.send(portriat) 
  }
});


exports.getPortraits = asyncHandler(async (req, res, next) => {
    const portriats = await Portrait.find({});
    if(portriats){
        res.send(portriats) 
    }
  
  });
  