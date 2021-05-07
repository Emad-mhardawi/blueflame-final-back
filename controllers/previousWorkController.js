const PreviousWork = require("../models/previousWorkModel");
const asyncHandler = require("express-async-handler");

exports.getPreviousWork = asyncHandler(async (req, res, next) => {
    const page_size = 14;
    const page = req.query.page || 0 ;
    const category = req.query.category;
    console.log(category);

    

    let total;
    let previousWork;
    if(category){
        total = await PreviousWork.countDocuments({category:category})
        previousWork =  await PreviousWork.find({category:category})
       .limit(page_size)
       .skip(page_size * page) 
       
    }else{
        total = await PreviousWork.countDocuments({})
         previousWork =  await PreviousWork.find({})
        .limit(page_size)
        .skip(page_size * page) 
    }

 
 
 if(previousWork){ 
     console.log(total)
     res.status(200).send({
         totalPages : Math.ceil(total / page_size),
         previousWork
        })
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


