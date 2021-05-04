const PreviousWork = require("../models/previousWorkModel");
const asyncHandler = require("express-async-handler");




exports.getPreviousWork = asyncHandler(async (req, res, next) => {
 const previousWork =  await PreviousWork.find({});
 if(previousWork){
     res.status(200).send(previousWork)
 }else{
    res.status(404);
    throw new Error("no previous work found");
 }
});

exports.PostAddPreviousWork = asyncHandler(async (req, res, next) => {
 const {name, category, description, madeBy, imageUrl} = req.body;
 if (!name) {
    res.status(400);
    throw new Error("name is required");
}

if (!category) {
    res.status(400);
    throw new Error("category is required");
}

if (!madeBy) {
    res.status(400);
    throw new Error("madeBy is required");
}

const previousWork = await PreviousWork.create({
    name, category, description, madeBy, imageUrl
})
if(previousWork){
    res.status(200).send(previousWork)
}else{
    res.status(400);
    throw new Error("nothing was added, something went wrong");
}


});


